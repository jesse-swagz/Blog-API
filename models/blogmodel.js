

const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.ObjectId

const slugify = require('slugify')



const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    },
    author:{
        type: objectId,
        ref: 'User'
    },
    state:{
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    readCount:{
        type: Number,
        default: 0
    },
    readingTime:{
        type: String
    },
    tags:{
        type: Array
    },
    body:{
        type:String,
        required:true

    },
    slug: {
        type: String
    },
},
{
    timestamp:true
},
)

blogSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

blogSchema.pre(/^find/, function (next) {
    this.populate({
      path: 'author',
      select: '-__v -password -email',
    });
    next();
  });

blogSchema.pre(
    '/^find/', function(next){
        this.readCount = this.readCount + 1
        next()
    }
);

const blogModel = mongoose.model('Blog', blogSchema)






module.exports = blogModel