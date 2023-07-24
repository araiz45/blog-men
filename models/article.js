const mongoose = require("mongoose");
const {marked} = require('marked');
const slugify = require("slugify");
const creatDomPurify = require("dompurify");
const { JSDOM } =  require("jsdom");
const dompurify = creatDomPurify(new JSDOM().window)
const  { mangle }= require("marked-mangle");
const { gfmHeadingId } = require("marked-gfm-heading-id");

marked.use(mangle());
const options = {
	prefix: "my-prefix-",
};
marked.use(gfmHeadingId(options));


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String
    }, 
    markdown:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    sanitaizeHTML: {
        type: String,
        required: true,

    }
})

articleSchema.pre("validate", function(next) {
    if (this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    if(this.markdown){
        this.sanitaizeHTML = dompurify.sanitize(marked(this.markdown));
        // console.log(this.sanitaizeHTML);
    }
    next();
})

module.exports = mongoose.model("Article", articleSchema);