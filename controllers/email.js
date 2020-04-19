const data = require('../data/data.json');
const verifyemail = (email,cin)=>{
  const student = data.find((element)=>{
      if(element.email === email && element.cin === cin) {
            return element;
        }
  }) 
  if (!student || !student.id){
    return {}
  } else {
      return student
  }

}
module.exports.verifyemail = verifyemail;
