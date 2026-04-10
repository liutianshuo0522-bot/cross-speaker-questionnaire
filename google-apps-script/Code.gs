var SPREADSHEET_ID = "1k1h_JjotTir_m3WmuU3MmebZ_WQ1O2pbwHqouH9Pixk";
var RESPONSE_SHEET_NAME = "responses";
var ERROR_SHEET_NAME = "errors";
var RAW_SHEET_NAME = "raw_submissions";

function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID !== "PASTE_YOUR_GOOGLE_SHEET_ID_HERE") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet_(sheetName, headers) {
  var spreadsheet = getSpreadsheet_();
  if (!spreadsheet) {
    throw new Error("No spreadsheet available. Set SPREADSHEET_ID in Code.gs.");
  }

  var sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }
  syncHeaders_(sheet, headers);
  return sheet;
}

function syncHeaders_(sheet, headers) {
  var width = headers.length;
  var currentHeaders = [];

  if (sheet.getLastColumn() > 0) {
    currentHeaders = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), width)).getValues()[0];
  }

  var changed = currentHeaders.length < width;
  if (!changed) {
    for (var i = 0; i < width; i += 1) {
      if (String(currentHeaders[i] || "") !== String(headers[i] || "")) {
        changed = true;
        break;
      }
    }
  }

  if (changed) {
    if (sheet.getMaxColumns() < width) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), width - sheet.getMaxColumns());
    }
    sheet.getRange(1, 1, 1, width).setValues([headers]);
  }
}

function logError_(message, rawPayload) {
  try {
    var sheet = getOrCreateSheet_(ERROR_SHEET_NAME, [
      "server_timestamp",
      "message",
      "raw_payload"
    ]);
    sheet.appendRow([new Date(), message, rawPayload || ""]);
  } catch (innerError) {
    Logger.log("Failed to log error: " + innerError.message);
  }
}

function doPost(e) {
  var rawPayload = "";

  try {
    if (e && e.parameter && e.parameter.payload) {
      rawPayload = e.parameter.payload;
    } else if (e && e.postData && e.postData.contents) {
      rawPayload = e.postData.contents;
    }

    if (!rawPayload) {
      throw new Error("Request payload is empty.");
    }

    var payload = JSON.parse(rawPayload);
    var sheet = getOrCreateSheet_(RESPONSE_SHEET_NAME, [
      "server_timestamp",
      "participant_id",
      "listening_setup",
      "overall_notes",
      "client_timestamp",
      "page_url",
      "trial_id",
      "task",
      "trial_text",
      "blind_label",
      "actual_model",
      "display_order",
      "joyfulness",
      "naturalness",
      "more_joyful_sample",
      "same_person_likelihood"
    ]);

    var rawSheet = getOrCreateSheet_(RAW_SHEET_NAME, [
      "server_timestamp",
      "participant_id",
      "payload_json"
    ]);

    rawSheet.appendRow([
      new Date(),
      payload.meta && payload.meta.participantId ? payload.meta.participantId : "",
      JSON.stringify(payload)
    ]);

    var serverTimestamp = new Date();
    var participantId = payload.meta && payload.meta.participantId ? payload.meta.participantId : "";
    var listeningSetup = payload.meta && payload.meta.listeningSetup ? payload.meta.listeningSetup : "";
    var overallNotes = payload.meta && payload.meta.overallNotes ? payload.meta.overallNotes : "";
    var clientTimestamp = payload.meta && payload.meta.clientTimestamp ? payload.meta.clientTimestamp : "";
    var pageUrl = payload.meta && payload.meta.pageUrl ? payload.meta.pageUrl : "";

    Object.keys(payload.trials || {}).forEach(function(trialId) {
      var trial = payload.trials[trialId] || {};
      var samples = trial.samples || {};

      Object.keys(samples).forEach(function(blindLabel) {
        var sample = samples[blindLabel] || {};
        sheet.appendRow([
          serverTimestamp,
          participantId,
          listeningSetup,
          overallNotes,
          clientTimestamp,
          pageUrl,
          trialId,
          trial.task || "",
          trial.text || "",
          blindLabel,
          sample.actual || "",
          sample.displayOrder || "",
          sample.joyfulness || "",
          sample.naturalness || "",
          trial.moreJoyful || "",
          trial.samePersonLikelihood || ""
        ]);
      });
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    logError_(error.message, rawPayload);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "POST only" }))
    .setMimeType(ContentService.MimeType.JSON);
}
