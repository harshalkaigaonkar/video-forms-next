

export default async (
  _req,
  _res
) => {

 const {
  method,
  body,
  cookies,
  query
 } = _req;

 const {
  type,
  genre
 }  = query;

 const session = await unstable_getServerSession(_req, _res, authOptions);

 //  console.log("Cookies: ", cookies)

 if(!session) return _res.status(401).redirect("/login")

 switch(method) {
    case "GET": {
        const {
        } = body;
    
       try {
    
        
        return _res.status(201).json({
         type: "Success",
         
        });
      } catch(error) {
        return _res.status(500).json({
         type:"Failure",
         error:error.message.error || error.message,
        })
       }
    }
  case "POST": {
   const {
    } = body;

   try {

    
    return _res.status(201).json({
     type: "Success",
     
    });
  } catch(error) {
    return _res.status(500).json({
     type:"Failure",
     error:error.message.error || error.message,
    })
   }
  }
  default: {
   _res.setHeader("Allow", ["POST", "GET"]);
			return _res
				.status(405)
				.json({ 
     type: "Failure",
     error: {
      message: `Method ${method} is Not Allowed for this API.`
     }
     })
  }
 }
}
