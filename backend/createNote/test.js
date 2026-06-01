const { handler } = require("./index");

const event = {
  body: JSON.stringify({
    title: "My First Note",
    content: "Hello MediaNotes"
  })
};

handler(event)
  .then(console.log)
  .catch(console.error);