
import cnf from '../../../config/connect.cnf'

let url = cnf.mode === 'dev'
  ? `${cnf.devUrl}:${cnf.sslPort}/`
  : `${cnf.prodUrl}/`;

let org = 'Your Org Name';

let defaults ={
  tagline: `We get things done...`,
  footer: `Standard footer to all responses`
}


export default {

  create_enrol:[
    {p: `Your are one step away from creating an account to ${org} where ${defaults.tagline}`},
    {p: `An email is on its way. Once you confirm your email the account will be activated.`},
    {img: {alt:org, src: `${url}${cnf.media.icon}`}},
    {blockquote: `${defaults.tagline}`},
    {div: `${defaults.footer}`},
  ],

  start_reset:[
    {p: `If found; an email with instructions for resetting your account hase been sent`},
    {img: {alt:org, src: `${url}${cnf.media.icon}`}},
    {blockquote: `${defaults.tagline}`},
    {div: `${defaults.footer}`},
  ]
}
