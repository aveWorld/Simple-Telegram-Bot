const Telegraf = require('telegraf');
const config = require('./config.json'); // Holds Telegram API token plus YouTube API token
const Markup = require("telegraf/markup"); // Get the markup module
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");

  

const bot = new Telegraf(config.token);

// Start Bot
bot.start(ctx => {
    ctx.reply(
      `How can I help you, ${ctx.from.first_name}?`,
      Markup.inlineKeyboard([
        Markup.callbackButton("🖩 Calculate", "Calculator")
      ]).extra()
    );
  });

 
  
  // Go back to menu after action
  bot.action("BACK", ctx => {
    ctx.reply(`Glad I could help`);
    ctx.reply(
      `Do you need something else, ${ctx.from.first_name}?`,
      Markup.inlineKeyboard([
        Markup.callbackButton("👁 Watch Info", "Info"),
        Markup.callbackButton("🖩 Calculate", "Calculator")
      ]).extra()
    );
  });

  //Get info after action
  bot.action("Info", ctx => {
    ctx.reply('it is the test bot\nCreator is : "@Ave_u"');
    ctx.reply(
      `Do you need something else, ${ctx.from.first_name}?`,
      Markup.inlineKeyboard([
        Markup.callbackButton("🖩 Calculate", "Calculator")
      ]).extra()
    );
  });

  

  let first_number;
  let second_number;
  let summary;
  let item;

  function calc(number1,number2,item){
    let result;
    if(item === '+') result = +number1 + +number2;
    else if(item === '-') result = number1 - number2;
    else if(item === '/') result = number1 / number2;
    else if(item === '*') result = number1 * number2;
    return result;
  }
  
  // Currency converter Wizard
  const calculator = new WizardScene(
    "Calculator",
    ctx => {
      ctx.reply("Please, type the fist number");
      return ctx.wizard.next();
      
    },
    ctx => {
        if(!isNaN(ctx.message.text)){
      first_number = ctx.message.text;
      ctx.reply(
        'Got it,now type what you wanna do,For example "*" "+" "/" "-" '
      );
      // Go to the following scene
      return ctx.wizard.next();
        }
      else ctx.reply("Please type a number!");
    },
    ctx => {
      if(ctx.message.text === '*' || ctx.message.text === '+' || ctx.message.text === '-' || ctx.message.text === '/'){
    item = ctx.message.text;
    ctx.reply(
      'Got it,now type the second number'
    );
    // Go to the following scene
    return ctx.wizard.next();
      }
    else ctx.reply("You can type only '*','-','+','/'");
  },
    ctx => {
      
      if(!isNaN(ctx.message.text)){
        second_number = ctx.message.text;
      
      
        ctx.reply(

          `Answer = ${calc(first_number,second_number,item)}`,
          Markup.inlineKeyboard([
            Markup.callbackButton("👁 Watch Info", "Info"),
            Markup.callbackButton("🔙 Back to Menu", "BACK"),
            Markup.callbackButton(
              "🖩 Calculate another numbers",
              "Calculator"
            )
          ]).extra()
        );
        return ctx.scene.leave();
        }
        else ctx.reply("Please type a number!");
      });
   
  
  
  // Scene registration
  const stage = new Stage([calculator], { default: "Calculator" });
  bot.use(session());
  bot.use(stage.middleware());
  bot.startPolling(); // Start polling bot from you computer