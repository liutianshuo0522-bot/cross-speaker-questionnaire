function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("responses");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("responses");
    sheet.appendRow([
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
  }

  var payload = JSON.parse(e.postData.contents);

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
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, message: "POST only" }))
    .setMimeType(ContentService.MimeType.JSON);
}
