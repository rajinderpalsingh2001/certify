from django.http import *
from django.shortcuts import *
import sqlite3
from django.views.decorators.csrf import *
import smtplib


def index(request):
    return render(request, 'index.html')

def mail(name,certificatedata,filename,email_send,email_user,email_password):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    from email.mime.base import MIMEBase
    from email import encoders

    msg = MIMEMultipart()
    msg['From'] = email_user
    msg['To'] = email_send
    msg['Subject'] = 'Certificate of Contribution to Makes Math Easy'
    msg['X-Priority'] = '6'
    body = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Makes Math Easy</title></head><body style="padding: 20px;"><a href="https://github.com/makesmatheasy/"><img style="width:100%;" src="https://user-images.githubusercontent.com/60106112/120443762-98c48180-c3a4-11eb-90ef-d4f44763f82d.jpg" alt="Makes Math Easy Banner"></a><div style="padding: 15px;border:1px solid black;"><p>Thanks <b>'+name+'</b> for Contributing to Makes Math Easy</p><p>We really appreciate your valueable contribution</p> <br><p> We are so grateful for contributors who have added core features and improved existing ones throughout the history of our project.We hope you learned something Great while Contributing. Just keep this learning energy up, success will come to you by itself.</p><hr><div> Regards<p><b>Rajinderpal Singh</b> <br> <b>Founder</b></p></div></div><h3>Connect with me</h3> <a href="https://www.linkedin.com/in/rajinderpalsingh2001/"><img src="https://cdn.exclaimer.com/Handbook%20Images/linkedin-icon_32x32.png" alt="LinkdeIn"></a> <a href="https://www.instagram.com/__sairish__/"><img src="https://cdn.exclaimer.com/Handbook%20Images/instagram-icon_32x32.png" alt="Instagram"></a> <a href="https://twitter.com/sairish2001"><img src="https://cdn.exclaimer.com/Handbook%20Images/twitter-icon_32x32.png" alt="Twitter"></a><h3>Follow Makes Math Easy Social Handles</h3> <a href="https://www.linkedin.com/company/makes-math-easy"><img src="https://cdn.exclaimer.com/Handbook%20Images/linkedin-icon_32x32.png" alt="LinkedIn"></a> <a href="https://www.instagram.com/makesmatheasy/"><img src="https://cdn.exclaimer.com/Handbook%20Images/instagram-icon_32x32.png" alt="Instagram"></a><p>Join Discord Server for future Communications, and Discussions.</p> <a href="https://discord.gg/avkTxBcyyF"><img style="height:40px;" src="https://discord.com/assets/ca03beabe94d8f97ba6fbf75cbb695c4.png" alt="Discord"></a> <br> <br><div style="text-align:center;"><b>You can find your Certificate as an Attachment</b></div><br> <a style="text-decoration: none;color:black;" href="https://forms.gle/RLSJRg8GNLgNVwP5A"><div style="padding:20px;font-size:1.5rem;padding:20px;border-radius:50px;text-align:center;wdith:80%;background-color:#FF23BB;"> Feedback</div></a></body></html>'
    msg.attach(MIMEText(body, 'html'))

    part = MIMEBase('image', 'png')
    part.set_payload(certificatedata)
    part.add_header('Content-Transfer-Encoding', 'base64')
    part['Content-Disposition'] = 'attachment; filename="%s"' % filename
    msg.attach(part)

    # filename = 'Makes Math Easy.png'
    # attachment = open(filename, 'rb')

    # part = MIMEBase('application', 'octet-stream')
    # part.set_payload((attachment).read())
    # encoders.encode_base64(part)
    # part.add_header('Content-Disposition', "attachment; filename= " + filename)
    # msg.attach(part)

    text = msg.as_string()
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(email_user, email_password)

    server.sendmail(email_user, email_send, text)
    server.quit()

@csrf_exempt
def sendemail(request):
    import json
    if (request.method == 'POST'):
        data = json.loads(request.body)

        # import base64
        # base64String = data['certificatedata']
        # with open(data['filename'], "wb") as f:
        #     f.write(base64.b64decode(base64String))
        try:
            mail(data['name'],data['certificatedata'],data['filename'],data['email'],data['useremail'],data['userpassword'])
            return JsonResponse({'msg':'success'},safe=False)
        except:
            return JsonResponse({'msg': 'failed'}, safe=False)
