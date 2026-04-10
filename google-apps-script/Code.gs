var SPREADSHEET_ID = "1B7LC3hGP8YD_ue4le2eMUBFHWvHIVwaPFspAi9ZM5vg";
var RESPONSE_SHEET_NAME = "responses";
var ERROR_SHEET_NAME = "errors";

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
    sheet.appendRow(headers);
  }
  return sheet;
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
      "global_h2a",
      "global_h2b_weakness",
      "global_h2b_coupling",
      "global_comment",
      "payload_json"
    ]);

    sheet.appendRow([
      new Date(),
      payload.meta && payload.meta.participantId ? payload.meta.participantId : "",
      payload.meta && payload.meta.listeningSetup ? payload.meta.listeningSetup : "",
      payload.meta && payload.meta.overallNotes ? payload.meta.overallNotes : "",
      payload.global && payload.global.h2a ? payload.global.h2a : "",
      payload.global && payload.global.h2bWeakness ? payload.global.h2bWeakness : "",
      payload.global && payload.global.h2bCoupling ? payload.global.h2bCoupling : "",
      payload.global && payload.global.comment ? payload.global.comment : "",
      JSON.stringify(payload)
    ]);

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
