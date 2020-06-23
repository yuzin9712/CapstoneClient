import * as React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import {post} from 'axios';
import {get} from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { yujinserver } from '../../restfulapi';
import emailjs from 'emailjs-com'


export default class TradeApply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          open: false
      }
     
      this.handleClickOpen = this.handleClickOpen.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.add = this.add.bind(this);
    }

    add(){

     this.addCustomer();
      this.setState({
     
        open:false
    });
    window.location.reload();
    }
    
    addCustomer(){
      const url = yujinserver+'/admin/shops/'+this.props.id;
    const formData = new FormData();
    const emailC = {
      title: '멋쟁이마당 제휴 승인 메일입니다.',
      contents: '안녕하십니까 멋쟁이마당입니다. 제휴승인을 축하드립니다. 감사합니다.'+Date.now(),
      give_men : this.props.email
  }
  
  
    //전달하고자하는 data에 파일이 포함되어있을때, 서버에 전송할때는 웹표준에 맞는 헤더를 추가해줘야한다
    const config ={
        headers:{
            'content-type':'multipart/form-data'
        }
    }
    return get(url,formData,config)
    .then((text) => {
      if(text.data === "success"){
        console.log("성공이요")
        emailjs.send("1234", "template_gKmhe134", emailC, "user_0itOJn1aftoqkWwVIDfq3")
        .then(
          (res) => console.log(res), 
          (error) => console.error(error)
        )
      }
    }); //axios에 있는post라이브러리를 이용해서 해당 url의 formData를 해당환경설정에맞게 헤더를 붙여서 실제로 서버로 데이터를 보내는거임
}
    
    
    


  handleClickOpen(){
    this.setState({
        open: true
    });
}

handleClose(){
  this.setState({
     
      open:false
  })
}
    render() { 
      
     
      return(  
       <React.Fragment>
          
           <TableRow>
                 <TableCell>{this.props.id}</TableCell>
                <TableCell>{this.props.shopname}</TableCell>
                <TableCell>{this.props.shopurl}</TableCell>
                <TableCell>{this.props.email}</TableCell>
                <TableCell>{this.props.phone}</TableCell>
                <TableCell><button onClick={this.handleClickOpen}>제휴맺기</button></TableCell>
            </TableRow>
          
          
            <Dialog open={this.state.open}> 
             <DialogTitle >
                경고
             </DialogTitle>
             <DialogContent>
                <Typography gutterBottom>
                    선택한 쇼핑몰과 제휴를 맺습니다.
                </Typography>
             </DialogContent>
             <DialogActions>
                <Button variant="contained" color="primary" onClick={this.add}> 확인</Button> 
                <Button variant="outlined" color="primary" onClick={this.handleClose}> 닫기</Button> 

             </DialogActions>
         </Dialog>
       </React.Fragment>
        );   
    }
}





