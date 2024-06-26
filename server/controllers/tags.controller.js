const Tag = require("../models/tags");

exports.createTag = async(req , res) => {
    try{
        const {name , description} = req.body;
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Name and Description are required"
            })
        }
        const tag = await Tag.find({name: name});
        console.log(tag)
        if(tag.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Tag already exists"
            })
        }

        const newTag = new Tag({
            name,
            description
        })
        await newTag.save();
        return res.status(200).json({
            success: true,
            message: "Tag created successfully"
        })
    }catch(e){
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating tag"
        })
    }
}


exports.showAllTags = async function(req , res) {
    try{
        const tags = await Tag.find({} , {name : true , description : true}); 
        return res.status(200).json({
            success: true,
            message: "Tags fetched successfully",
            tags
        })
    }catch(e){
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching tags"
        })
    }
}

exports.tagsPageDetails =async function (req, res){
    try {
        const {tagId} = req.body;
        const currentTagCourses = await Tag.findById(tagId).populate("courses").exec();
        if(!currentTagCourses){
            return res.status(404).json({
                success: false,
                message: "course not found"
            })
        }
        const differentTagsCourses = Tag.findById(
            {_id : {$ne : tagId}}
        ).populate("courses").exec();
        //Todo :  get top selling courses
        
        return res.status(201).json({
            success: true,
            message: "Tags fetched successfully",
            currentTagCourses,
            differentTagsCourses
        })
    }catch(e){
        return res.status(500).json({
            success: false, 
            message: "Something went wrong while fetching tags",
            error: e.message,
        })
    }
}

