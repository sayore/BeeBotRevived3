import { Logging } from "supernode/Base/mod";

/**
 * Extracts user mentions from a given message string.
 * 
 * @param msgstr The message string to extract mentions from.
 * @returns An array of user IDs mentioned in the message.
 */
export function getMentions(msgstr: string): string[] | null {
  let rets = [];
  let safety = 200;
  var idscan = "";
  while (msgstr.includes("<@!")) {
      let pos = msgstr.indexOf("<@!");
      idscan = "";

      do {
          if ("0123456789".includes(msgstr.charAt(pos))) idscan += msgstr.charAt(pos)
          /**console.log(msg.content.charAt(pos))*/
          safety--;
          pos++;
          if (safety == 0) { Logging.log("Needed to break"); break; }
      } while (msgstr.charAt(pos) != ">");

      console.log(idscan);
      msgstr = msgstr.replace("<@!" + idscan + ">", "");
      //msgstr.replace(idscan,"");
      rets.push(idscan);
  }
  while (msgstr.includes("<@")) {
      let pos = msgstr.indexOf("<@");
      idscan = "";

      do {
          if ("0123456789".includes(msgstr.charAt(pos))) idscan += msgstr.charAt(pos)
          /**console.log(msg.content.charAt(pos))*/
          safety--;
          pos++;
          if (safety == 0) { Logging.log("Needed to break"); break; }
      } while (msgstr.charAt(pos) != ">");

      console.log(idscan);
      msgstr = msgstr.replace("<@" + idscan + ">", "");
      //msgstr.replace(idscan,"");
      rets.push(idscan);
  }
  return rets ?? null;
}