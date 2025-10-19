const User = require('../models/User.models');


const GetProfile = async(req,res)=>{
    console.log("insidee GetProfile ");
    try
    {
        const userId = req.user._id;

        if(!userId)
        { 
            return res.status(400).json({message:"Profile Not Found", success:false});
        }

        const user = await User.findOne({_id : userId });

        if(!user)
        {
            return res.status(400).json({message : "User Not Found", success:false})
        }

        return res.status(200).json({message:"User Found",success : true, data:user})

    }
    catch(error)
    {
        console.log("Error occured att get profile",error);
        return res.status(400).json({message:"Profile Not Found", success:false});
    }

}

const updateUser = async(req,res)=>{
    console.log(" inside Update User S")
    const {Name,Email} = req.body;
    const userId = req.user._id;
    try
    {
        if(Name && Email)
        {
            // const user = await User.findOneAndUpdate(
            //     { _id:userId},
            //     {$set : {Name : Name},
            //      $set : {Email : Email} 
            //     },
            //     {new : true},
            // )
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $set: { Name, Email } },
                { new: true }
              );

            await user.save();

            return res.status(200).json({message : "Update Sucessfull", success : true, data:user})
        }


        if(Name)
        {
            const user = await User.findOneAndUpdate(
                { _id:userId},
                {$set : {Name : Name}},
                {new : true},
            )

            await user.save();

            return res.status(200).json({message : "Update Sucessfull", success : true, data:user})
        }


        if(Email)
        {
            const user = await User.findOneAndUpdate(
                { _id:userId},
                {
                 $set : {Email : Email} 
                },
                {new : true},
            )

            await user.save();

            return res.status(200).json({message : "Update Sucessfull", success : true, data:user})
        }    
        
    }
    catch(error)
    {
        console.log("Error at the UpdateUser", error);
        return res.status(400).json({message : "Internsl Server Error", success : false})
    }
}



module.exports = { updateUser,GetProfile};