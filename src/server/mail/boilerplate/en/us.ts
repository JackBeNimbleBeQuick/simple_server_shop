
/*
reference for replacements as they are created
  .implementations are found in:
  .. server/mail/mailer
*/
let replacements = [
  '__HOST_PATH__',
  '__NAME__',
];

let org = 'Your Org Name';
let icon =  `<img alt="${org}" src="__HOST_PATH__/public/icons/icon.png" />`;

let defaults ={
  //base
  link: ``,
  name: ``,
  org: org,
  tagline: `We get things done...  ${icon}`,
  footer: `Standard footer to all emails`
}

export default {

  create_enrol: {
    address: [],
    subject: `Thank you for enrolling with ${defaults.org}`,
    body: `
    <p>
    Your are one step away from creating an account to ${org} where ${defaults.tagline}:
    </p>

    <p>
    Your are one step away from enrolling please confirm with this link ${defaults.link}
    </p>

    <blockquote>
    ${defaults.tagline}
    </blockquote>
    <div>
    ${defaults.footer}
    </div>
    `.replace(/(\n)/g,'').split(/\s{2,}/).join(""),
    //remove line breaks and extra spaces
  },

  confirm_enrol: {
    address: [],
    subject: `Thank you for creating an account with ${defaults.org}`,
    body: `
    <p>
    Welcome __NAME__ to ${org} where ${defaults.tagline}:
    </p>

    <p>
    Your account had been created with ${defaults.link}
    </p>

    <blockquote>
    ${defaults.tagline}
    </blockquote>
    <div>
    ${defaults.footer}
    </div>
    `.replace(/(\n)/g,'').split(/\s{2,}/).join(""),
    //remove line breaks and extra spaces
  },

  start_reset: {
    address: [],
    subject: `A reset request has been received for ${defaults.org}`,
    body: `
    <p>
    Hello __NAME__,
    </p>

    <p>
    To confirm this reset please use this link ${defaults.link}
    </p>

    <blockquote>
    ${defaults.tagline}
    </blockquote>
    <div>
    ${defaults.footer}
    </div>
    `.replace(/(\n)/g,'').split(/\s{2,}/).join(""),
    //remove line breaks and extra spaces
  },

  confirm_reset: {
    address: [],
    subject: `Your account has been reset ${defaults.org}`,
    body: `
    <p>
    Hello __NAME__,
    </p>

    <p>
    This is confirm your account reset to ${org}
    </p>

    <p>
    If you have any questions about this action please use this link ${defaults.link}
    </p>

    <blockquote>
    ${defaults.tagline}
    </blockquote>
    <div>
    ${defaults.footer}
    </div>
    `.replace(/(\n)/g,'').split(/\s{2,}/).join(""),
    //remove line breaks and extra spaces
  },


}
