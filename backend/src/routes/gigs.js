import { supabase } from "../utils/db.js";

export async function getAllGig(req, res) {
    try {
        const { data, error } = await supabase
            .from('gigs')
            .select()
        
        if(error === null){
            res.status(200).json(data);
        }else{
            res.status(400).json({message: error});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
        
    }
};
export async function getSingleGig(req, res) {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('gigs')
            .select()
            .eq("id", id)
        
        if(error === null && data != ""){
            res.status(200).json(data);
        }else{
            res.status(400).json({message: error});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: err});
        
    }
};


export async function postGig(req, res) {
    try {
        const {
            title,
            amount,
            building,
            location,
            description,
            category,
            start,
            start_time,
            end_time,
            date,
            host,
            requirements,
            img
        } = req.body;
        const { error } = await supabase
            .from('gigs')
            .insert({
                title: title,
                amount: amount,
                building: building,
                location: location,
                description: description,
                category: category,
                start: start,
                start_time: start_time,
                end_time: end_time,
                date: date,
                host: host,
                requirements: requirements,
                img: img
             })
        if(error === null){
            res.status(200).json({ message: "Gig created Succcesfully"})
        }else{
            console.log(error);
            res.status(400).json({ message: "Gig is not created Succcesfully"})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error"})
    }
};

export async function updateGig(req, res) {
    try {
        const { id } = req.params;
        const update = req.body;

        const { data, error } = await supabase
            .from('gigs')
            .update(update)
            .eq('id', id)
            .select()

        if(error === null){
            res.status(200).json({ message: "Gig updated Succcesfully", data: data})
        }else{
            console.log(error);
            res.status(400).json({ message: "Gig is not updated Succcesfully"})
        }
        
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error"})
    }
}
export async function deleteGig(req, res) {
    try {
        const { id } = req.params;
        const response = await supabase
            .from('gigs')
            .delete()
            .eq('id', id)

        if(response.status === 204){
            res.status(200).json({ message: `Gig deleted successfully`})
        }else{
            console.log(error);
            res.status(400).json({ message: "Gig is not deleted Succcesfully"})
        }
        
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error"})
    }
}