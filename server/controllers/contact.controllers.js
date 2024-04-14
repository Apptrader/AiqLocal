
import nodemailer from 'nodemailer';


export const sendEmail = async (req, res) =>{
    try {
      const { firstName, lastName, email, message } = req.body;

    const contentHTML = `
    <h1>This</h1>
    <ul>
        <li>Name: ${firstName}</li>
        <li>Lastname: ${lastName}</li>
        <li>User Email: ${email}</li>
        
    </ul>
    <p>${message}</p>
    `;

    
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
      auth: {
          user: 'proyectoapptrader@gmail.com',
          pass: 'alddcdxowxoptvmc'
      }
  });
    

    let info = await transporter.sendMail({
        from: email, // sender address,
        to: 'proyectoapptrader@gmail.com',
        subject: 'Website Contact Form',
        // text: 'Hello World'
        html: contentHTML
    })

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    res.json({sended: "ok"})
    } catch (error) {
      console.log(error)
      res.json(error)
    }
   
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

   //res.redirect('/success.html');
}


