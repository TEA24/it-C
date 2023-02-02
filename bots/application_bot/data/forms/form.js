const {
  Client,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Modal,
  TextInputComponent,
} = require("discord.js");
const data = require("../config");

/**
 *
 * @param {Client} client
 * @param {data} data
 */
module.exports = async (client, data) => {
  // code

  client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
      switch (interaction.commandName) {
        // HELP COMMAND
        case "help":
          {
            interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Help!")
                  .setColor("#bc07f0")
                  .setFields([
                    { name: "Info Commands", value: "`/ping`, `/help`" },
                    { name: "Application Commands", value: "`/setup`" },
                    {
                      name: "Credits",
                      value: "Taim#9504",
                    },
                  ]),
              ],
              ephemeral: true,
            });
          }
          break;

        // HELP COMMAND END
        case "setup":
          {
            let applyChannel = interaction.guild.channels.cache.get(
              data.applyChannel
            );
            if (!applyChannel) return;

            let btnrow = new MessageActionRow().addComponents([
              new MessageButton()
                .setStyle("SUCCESS")
                .setCustomId("ap_apply")
                .setLabel("Apply")
                .setEmoji("📝"),
              new MessageButton()
                .setStyle("PRIMARY")
                .setCustomId("ap_help")
                .setLabel("Help!")
                .setEmoji("❓"),
            ]);
            applyChannel.send({
              content: '**Welcome to it community**\n\n\`\`\`سلام عليكم\n\nالتقيدم على التيم مفتوح في حال تريد التقديم\n\nاضغط على الزر الموجود في الاسفل\n\n\`\`\`\n > \\@everyone',
              embeds: [
                new MessageEmbed()
                  .setColor("#bc07f0")
                  .setTitle(`Application Form`)
                  .setDescription(
                    "**لتقديم على الاداره اضغط على الزر الموجود في الاسفل**"
                  )
                  .setImage(
                    "https://cdn.discordapp.com/attachments/1067734562710503445/1067735839519539251/IT_BOT_Support.png"
                  )
                  .setFooter("Made By Taim#9504", 'https://cdn.discordapp.com/icons/1060358194926473216/65249247ae3711b4beb0af0414fb398f.png?size=1024'),
              ],
              components: [btnrow],
            });

            interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#00FFFF")
                  .setTitle("✅ Application Sucess")
                  .setDescription(
                    `setup has been sucesfully completed in ${applyChannel} `
                  ),
              ],
            });
          }
          break;
        case "ping":
          {
            interaction.reply({
              content: `pong :: ${client.ws.ping}`,
              ephemeral: true,
            });
          }
          break;

        default:
          interaction.reply({
            content: `command not found ${interaction.commandName}`,
            ephemeral: true,
          });
          break;
      }
    }

    // for buttons
    if (interaction.isButton()) {
      switch (interaction.customId) {
        case "ap_help":
          {
            interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle('How to apply?')
                  .setColor('#00FFFF')
                  .setDescription('Click on the above apply button and fill the form.')
              ],
              ephemeral: true,
            });
          }
          break;

        case "ap_apply":
          {
            let application_modal = new Modal()
              .setTitle(`Application System`)
              .setCustomId(`application_modal`);

            const user_name = new TextInputComponent()
              .setCustomId("ap_username")
              .setLabel(`What is your discord username?`.substring(0, 45))
              .setMinLength(4)
              .setMaxLength(50)
              .setRequired(true)
              .setPlaceholder(`ee3#5965`)
              .setStyle("SHORT");

            const user_why = new TextInputComponent()
              .setCustomId("ap_userwhy")
              .setLabel(`Why are you still here? subscribe to ee3`.substring(0, 45))
              .setMinLength(4)
              .setMaxLength(100)
              .setRequired(true)
              .setPlaceholder(`https://www.youtube.com/channel/UCmJE0LBj20_7302l8596N7w`)
              .setStyle("SHORT");

            let row_username = new MessageActionRow().addComponents(user_name);
            let row_userwhy = new MessageActionRow().addComponents(user_why);
            application_modal.addComponents(row_username, row_userwhy);

            await interaction.showModal(application_modal);
          }
          break;
        case "ap_accept":
          {
            let embed = new MessageEmbed(
              interaction.message.embeds[0]
            ).setColor("GREEN");

            interaction.message.edit({
              embeds: [embed],
              components: [],
            });

            let ap_user = interaction.guild.members.cache.get(
              embed.footer.text
            );

            ap_user
              .send(`Your application has been approved by **<@${interaction.user.id}>**`)
              .catch((e) => { });

            await interaction.member.roles
              .add(data.acceptedRole)
              .catch((e) => { });
            await interaction.member.roles
              .remove(data.waitingRole)
              .catch((e) => { });
          }
          break;
        case "ap_reject":
          {
            let embed = new MessageEmbed(
              interaction.message.embeds[0]
            ).setColor("RED");

            interaction.message.edit({
              embeds: [embed],
              components: [],
            });

            let ap_user = interaction.guild.members.cache.get(
              embed.footer.text
            );

            ap_user
              .send(`Your application has been rejected by <@${interaction.user.id}>`)
              .catch((e) => { });
            await interaction.member.roles
              .remove(data.waitingRole)
              .catch((e) => { });
          }
          break;
        default:
          break;
      }
    }

    // for modals
    if (interaction.isModalSubmit()) {
      let user_name = interaction.fields.getTextInputValue("ap_username");
      let user_why = interaction.fields.getTextInputValue("ap_userwhy");

      let reviewChannel = interaction.guild.channels.cache.get(
        data.reviewChannel
      );
      if (!reviewChannel) return;
      let btnrow = new MessageActionRow().addComponents([
        new MessageButton()
          .setStyle("SUCCESS")
          .setCustomId("ap_accept")
          .setLabel("Accpet")
          .setEmoji("✅"),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("ap_reject")
          .setLabel("Reject")
          .setEmoji("❌"),
      ]);

      reviewChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#00FFFF")
            .setTitle(`Application From ${interaction.user.tag}`)
            .setDescription(
              `${interaction.user} <t:${Math.floor(Date.now() / 1000)}:R>`
            )
            .addFields([
              {
                name: `WHAT IS YOUR DISCORD NAME?`,
                value: `> ${user_name}`,
              },
              {
                name: `WHY ARE YOU STILL HERE? SUBSCRIBE TO EE3`,
                value: `> ${user_why}`,
              },
            ])
            .setFooter({
              text: `${interaction.user.id}`,
              iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            }),
        ],
        components: [btnrow],
      });

      interaction.reply({
        content: `your application send for review`,
        ephemeral: true,
      });

      await interaction.member.roles.add(data.waitingRole).catch((e) => { });
    }
  });
};
