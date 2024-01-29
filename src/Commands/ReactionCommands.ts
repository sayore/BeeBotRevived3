import { Message } from "discord.js";
import { Command } from "../Structures/Command";
import { EmbedBuilder } from 'discord.js';
import { prefix } from "../Globals";
import { ReactionData } from "../DataModels/ReactionData";
import { template } from "lodash";
import { RandomUtils } from "../Utility/AnyHelper";
import { getMentions } from "../Utility/MessageHelper";
import _ from "lodash";
import { Load } from "../DataModels/Load";
import { UserData } from "../DataModels/mod";
import { reactionImages, reactionDefaults } from "../Data/ReactionImages";

export class ReactionCommand extends Command {
  constructor() {
    super();

    reactionImages.forEach((image) => {
      ReactionData.addOrUpdate(image.reaction, image?.template, image?.templateSingle, image?.templateMulti, {}, image.link)
    });
  }
  public async triggerfunc(msg: Message<boolean>): Promise<boolean|undefined> {
    // Check different reaction states (like kiss, hug, cuddle, etc.)
    // Return true if the reaction is contained in a list of reaction strings
    // Else return false
    
    let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);
    let reaction = command;
    console.log(reaction);
    if (reactionImages.find((image) => image.reaction === reaction) !== undefined ) {
      // Check if reaction has an image
      // If it has an image, return true
      // Else return false
      let reactionImage = reactionImages.find((image) => image.reaction === reaction);
      if (reactionImage !== undefined) {
        return true;
      }
    }
    return false;
  }
  async cmd(msg: Message<boolean>): Promise<boolean | void> {
    let [command, ...args] = msg.content.slice(prefix.length).trim().split(/ +/);
    try {
      let mentions = getMentions(msg.content);
      let mentionsUserData : UserData[] = [];
      let sender = await Load.UserData(msg.author.id);

      //mentioned user/s should get their respective Data Loaded
      if (mentions.length > 0) {
        await Promise.all(mentions.map(async (mention) => {
          mentionsUserData.push(await Load.UserData(mention));
        }));
      }

      // Grab random image from reactionImages matching the reaction requested
      // If no image is found, return false
      // Else return true
      console.log("ReactionCommand");
      let reaction = command.toLowerCase();
      let filteredImages = reactionImages.filter((image) => image.reaction == reaction);
      let reactionImage = filteredImages[Math.floor(Math.random() * filteredImages.length)];
      if (reactionImage === undefined) {
        throw new Error("No image found for the requested reaction");
      }
      let image = reactionImage.link;

      // Switch depending on mentions
      // - If no mentions, use templateAlone
      // - If one mention, use templateSingle
      // - If multiple mentions, use templateMulti
      // - If no template is found, return false
      // Else return true
      let selectedReactionTemplate : string | string[] = "";
      if (mentions.length == 0) {
        selectedReactionTemplate = reactionImages.find((image) => image.reaction === reaction)?.template
          ?? reactionDefaults.find((reactionDefault) => reactionDefault.reaction === reaction)?.templateAlone
          ?? "No template found for this reaction";
      } else if (mentions.length == 1) {
        selectedReactionTemplate = reactionImages.find((image) => image.reaction === reaction)?.templateMulti
          ?? reactionDefaults.find((reactionDefault) => reactionDefault.reaction === reaction)?.templateTarget
          ?? "No template found for this reaction";
      } else if (mentions.length > 1) {
        selectedReactionTemplate = reactionImages.find((image) => image.reaction === reaction)?.templateMulti
          ?? reactionDefaults.find((reactionDefault) => reactionDefault.reaction === reaction)?.templateMulti
          ?? "No template found for this reaction";
      } else {
        throw new Error("No template found for this reaction");
      }

      // If selectedReactionTemplate is an array, pick a random template from the array
      // Else, do nothing
      if (Array.isArray(selectedReactionTemplate)) {
        selectedReactionTemplate = selectedReactionTemplate[Math.floor(Math.random() * selectedReactionTemplate.length)];
      }

      // Use lodash template to replace variables in the template
      // - If no mentions, replace with oneself
      // - If one mention, replace with target
      // - If multiple mentions, replace with targetMulti
      // - If no template is found, return false
      // Else return true
      let selectedReactionTemplateString = "";
      if (mentions.length == 0) {
        selectedReactionTemplateString = template(selectedReactionTemplate)({oneself: await sender.getNickname(msg.guildId)});
      } else if (mentions.length == 1) {
        selectedReactionTemplateString = template(selectedReactionTemplate)({oneself: await sender.getNickname(msg.guildId), target: await mentionsUserData[0].getNickname(msg.guildId)});
      } else if (mentions.length > 1) {
        selectedReactionTemplateString = template(selectedReactionTemplate)({oneself: await sender.getNickname(msg.guildId), targetMulti: (await Promise.all(mentionsUserData.map(async (mention) => await mention.getNickname(msg.guildId)))).join(", ")});
      } else {
        throw new Error("No template found for this reaction");
      }
      console.log(selectedReactionTemplate)
      console.log(selectedReactionTemplateString)
      // Create embed with image
      // - Create embed
      // - Set image
      // - Send embed
      // - Return true
      // Else return false
      var createdEmbed = new EmbedBuilder()
        .setColor('#FFD35D')
        .setTitle(reactionImage.reaction.slice(0, 1).toUpperCase() + reactionImage.reaction.slice(1))
        .setDescription(selectedReactionTemplateString)
        .setImage(image);
      let sendEmbed = await msg.channel.send({ embeds : [createdEmbed] });

      // After 30 seconds, edit the embed to remove the image
      // - Modify embed
      // - Return true
      // Else return false
      setTimeout(async () => {
        var createdEmbed = new EmbedBuilder()
          .setColor('#FFD35D')
          .setTitle(reactionImage.reaction.slice(0, 1).toUpperCase() + reactionImage.reaction.slice(1) + " " + selectedReactionTemplateString)
        await sendEmbed.edit({ embeds : [createdEmbed] });
      }, 30000);


      return true;
    } catch (error) {
      console.error("Error in ReactionCommand:", error);
      return false;
    }
  };
}

