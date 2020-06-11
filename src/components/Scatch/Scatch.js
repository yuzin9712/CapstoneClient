import * as React from 'react';
import {post} from 'axios';
// import html2canvas from 'html2canvas';
// import white from '../../media/white.jpg'
import './Scatch.css';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import { Button } from '@material-ui/core';
import { sangminserver } from '../../restfulapi';

let canvas = null;

export default class Scatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
         totalimage :null
      }

        this.popdownClick= this.popdownClick.bind(this);
        this.capturebutton= this.capturebutton.bind(this);
        this.restart= this.restart.bind(this);
        this.storebasket1= this.storebasket1.bind(this);
        this.storebasket2= this.storebasket2.bind(this);
        this.storebasket3= this.storebasket3.bind(this);
        this.storebasket4= this.storebasket4.bind(this);
        this.storebasket5= this.storebasket5.bind(this);
        this.storebasket6= this.storebasket6.bind(this);
        this.storebasket7= this.storebasket7.bind(this);
        this.storebasket8= this.storebasket8.bind(this);
        this.storebasket9= this.storebasket9.bind(this);
        this.storebasket10= this.storebasket10.bind(this);
        this.storebasket11= this.storebasket11.bind(this);
        this.storebasket12= this.storebasket12.bind(this);
        this.storebasket13= this.storebasket13.bind(this);
        this.storebasket14= this.storebasket14.bind(this);
        this.storebasket15= this.storebasket15.bind(this);
        this.storebasket16= this.storebasket16.bind(this);
        this.storebasket17= this.storebasket17.bind(this);
        this.storebasket18= this.storebasket18.bind(this);
        this.storebasket19= this.storebasket19.bind(this);
        this.storebasket20= this.storebasket20.bind(this);
        this.storebasket21= this.storebasket21.bind(this);
        this.storebasket22= this.storebasket22.bind(this);
        this.storebasket23= this.storebasket23.bind(this);
        this.storebasket24= this.storebasket24.bind(this);
        this.storebasket25= this.storebasket25.bind(this);
       
     
    }

    componentDidMount() {
      
      initCanvas();
      canvas.on('mouse:down', function(options) {   
          // console.log(options.e.clientX, options.e.clientY);
          getIndex(canvas);
          
          $("#delete").click(function(){
          deleteObjects(canvas);
           });
      });
        
    }                                                                                       
    
    componentDidUpdate(){
     
      // console.log(this.props.basket);
    }
  
  popdownClick(){
  this.props.tochange(false); 
  }

  


   capturebutton(){  //이 함수는 내가 캔버스에 올린 전체 캡쳐와 캔버스위의 구성 object url을 보내는 함수임
     
    canvas.requestRenderAll(); 
    var can = document.getElementById('test');
    
    setTimeout(() => {
      console.log(can.toDataURL('image/png'));
  
      var imgData = atob(can.toDataURL('image/png').split(",")[1]);
      var len = imgData.length;
      var buf = new ArrayBuffer(len);
      var view = new Uint8Array(buf);
      var blob,i
        for(i = 0 ; i < len ; i++)
        {
          view[i] = imgData.charCodeAt(i) & 0xff;
        }
        blob = new Blob([view],{type:"image/jpeg"})
        console.log(blob);  //base64데이터는 서버에 파일형식으로 보내기 위해 blob형으로 보내야함, 서버에 blob형으로 보내면 서버에서 받을떄blob형으로 받은 data 끝에 
         //  console.log(canvas.toJSON().objects);   //zos
        
     
        const a = canvas.toJSON().objects.map (c=> c.src.replace('http://localhost:8080/images','https://swcap02.s3.ap-northeast-2.amazonaws.com'))
        console.log(a);
      const url = 'http://localhost:8001/closet/';
      const formData = new FormData();
    
      formData.append('image',blob)
      formData.append('product',a);
      const config ={
          headers:{
              'content-type':'multipart/form-data',
              'credentials': 'include'
          },
      }
      // return post(url,formData,config); //axios
      return fetch(url,{
        method: 'POST',
        body: formData,
        'content-type':'multipart/form-data',
        credentials: 'include'
      })
      .then((res) => {console.log(res)})
     
     }, 1000)

    
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 /* deletecodilist1(){  //////////////////////////////삭제버큰누르면 해당 props.basket.에 해당하는 제품을 basket에서 삭제시키고 나머지들로 구성된배열로 갱신시킴 ,그러다보니 props.basket[0]의영향을 받는 canvas캡쳐도갱신됨 이상하게되는부분이있다.
    let a =this.props.basket.filter(c=> c !== this.props.basket[0])
    this.props.updateUsercodilist(      
     a 
    )
    */
     // if(this.props.basket.length <6){ //props.basket[0]으로 물리적인제한을뒀으니.basket배열도 한정할필요가있음
     //const test = this.props.basket;
     //test.push(this.props.first);  
  
     
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  storebasket1(){ //버튼클릭하면 해당 상품 장바구니 DB로 연결
   console.log(this.props.basket[0]);
   fetch(sangminserver+'/cart/toolbar/',{
    method: "POST",
    body: "img="+this.props.basket[0].replace('http://localhost:8080/images','https://swcap02.s3.ap-northeast-2.amazonaws.com'),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
    credentials: 'include'
  })
   

    
  }
  
  storebasket2(){
    console.log(this.props.basket[1]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "img="+this.props.basket[1].replace('http://localhost:8080/images','https://swcap02.s3.ap-northeast-2.amazonaws.com'),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
    credentials: 'include'
  })
  }
  storebasket3(){
    console.log(this.props.basket[2]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "img="+this.props.basket[2].replace('http://localhost:8080/images','https://swcap02.s3.ap-northeast-2.amazonaws.com'),
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
    credentials: 'include'
  })
  }

  storebasket4(){
    console.log(this.props.basket[3]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[3],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket5(){
    console.log(this.props.basket[4]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[4],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket6(){
    console.log(this.props.basket[5]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[5],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket7(){
    console.log(this.props.basket[6]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[6],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket8(){
    console.log(this.props.basket[7]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[7],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket9(){
    console.log(this.props.basket[8]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[8],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket10(){
    console.log(this.props.basket[9]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[9],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket11(){
    console.log(this.props.basket[10]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[10],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket12(){
    console.log(this.props.basket[11]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[11],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket13(){
    console.log(this.props.basket[12]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[12],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket14(){
    console.log(this.props.basket[13]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[13],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket15(){
    console.log(this.props.basket[14]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[14],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket16(){
    console.log(this.props.basket[15]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[15],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket17(){
    console.log(this.props.basket[16]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[16],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket18(){
    console.log(this.props.basket[17]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[17],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket19(){
    console.log(this.props.basket[18]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[18],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket20(){
    console.log(this.props.basket[19]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[19],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket21(){
    console.log(this.props.basket[20]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[20],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket22(){
    console.log(this.props.basket[21]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[21],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket23(){
    console.log(this.props.basket[22]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[22],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket24(){
    console.log(this.props.basket[23]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[23],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  storebasket25(){
    console.log(this.props.basket[24]);
   fetch(sangminserver+'/cart/toolbar',{
    method: "POST",
    body: "imgurl="+this.props.basket[24],
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded', //서버에 데이터 보내는 또다른 방법 data타입별로 해더가 총 3가지 종류있다.
    },
  })
  }

  restart(){
  this.props.sketchResetItems();
  
  var activeObject = canvas._objects,
        activeobjectGroup = new fabric.ActiveSelection(activeObject, {              //여러개 선택하면 삭제 안되니깐 새로 패브릭으로 만들어주고
        canvas: canvas                                                              // 그걸 통으로 지우는 방식
      });
      if (activeobjectGroup) {
        // console.log(activeobjectGroup);
        activeobjectGroup.forEachObject(function(obj) {
          //console.log(obj);
        canvas.remove(obj);
      });
      }
      else {
        //console.log("aaaaaaaaaaaaaaaaa");
        //console.log(activeObject);
        canvas.remove(activeObject);
     
      }
      canvas.discardActiveObject();
      canvas.requestRenderAll();
  }
  
  
    //라이프사이플 밖의 영역
    render() {
   //라이프사이클안에있는 영역 
   
        return(
          <div style={{
            // display: this.props.isOpen   ?  true: 'none',
            // backgroundColor:'black',
            // width:'300px',
            height: '100vh',
            // position: 'absolute',
           border:'10px solid blue' ,
            top: '0',
            
            }}>

            
            <Button variant="outlined" onClick={this.capturebutton} >캔버스전체캡쳐뜨기와구성품보내기</Button>
            <Button variant="outlined" id="delete">캔버스위 선택된 이미지 삭제하기</Button>
            {/* <button onClick ={this.popdownClick}>코스튬툴 닫기</button>    */}
               
              
                    <div className="canvas-container"   >
                        <canvas id='test'> </canvas>
                    </div>
              
                    <button onClick={this.restart}>list초기화</button>   
                     <div className="furniture" style={{
    backgroundColor: 'aqua',
    height: '33%',
   
    overflowY: 'scroll',}}>
                       <Table>
                         <TableBody>
                      
               <TableRow>
              <TableCell><img src={this.props.basket[0]}  width='80'/></TableCell>
             <TableCell>   {this.props.basket[0]?   <button onClick={this.storebasket1}>장바구니담기</button>   :null}  </TableCell>
               </TableRow>
           
           
               <TableRow>
               <TableCell><img src={this.props.basket[1]}  width='80'/></TableCell>
               <TableCell> {this.props.basket[1]?  <button onClick={this.storebasket2}>장바구니담기</button>    :null}</TableCell>
               </TableRow>
               
               <TableRow>
               <TableCell><img src={this.props.basket[2]}  width='80'/></TableCell>
               <TableCell> {this.props.basket[2]?   <button onClick={this.storebasket3}>장바구니담기</button>    :null} </TableCell>
             </TableRow>
                 
                  
             <TableRow>
               <TableCell><img src={this.props.basket[3]}  width='80'/></TableCell>
               <TableCell>  {this.props.basket[3]?   <button onClick={this.storebasket4}>장바구니담기</button> :null} </TableCell>
             </TableRow>
             
               
             <TableRow>
               <TableCell><img src={this.props.basket[4]}  width='80'/></TableCell>
               <TableCell>  {this.props.basket[4]?   <button onClick={this.storebasket5}>장바구니담기</button>    :null} </TableCell>
             </TableRow>
             
             
                  <TableRow>
                    <TableCell><img src={this.props.basket[5]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[5]?  <button onClick={this.storebasket6}>장바구니담기</button> :null}  </TableCell>
                   
                  </TableRow>
               
                   
                  <TableRow>
                    <TableCell><img src={this.props.basket[6]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[6]?  <button onClick={this.storebasket7}>장바구니담기</button>    :null}</TableCell>
                   
                  </TableRow>
               
                  
                  <TableRow>
                    <TableCell><img src={this.props.basket[7]}  width='80'/></TableCell>
                    <TableCell> {this.props.basket[7]?  <button onClick={this.storebasket8}>장바구니담기</button>  :null} </TableCell>
                   
                  </TableRow>
                  
                 
                  <TableRow>
                    <TableCell><img src={this.props.basket[8]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[8]?  <button onClick={this.storebasket9}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>

                  <TableRow>
                    <TableCell><img src={this.props.basket[9]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[9]?  <button onClick={this.storebasket10}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[10]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[10]?  <button onClick={this.storebasket11}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[11]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[11]?  <button onClick={this.storebasket12}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[12]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[12]?  <button onClick={this.storebasket13}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[13]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[13]?  <button onClick={this.storebasket14}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[14]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[14]?  <button onClick={this.storebasket15}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[15]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[15]?  <button onClick={this.storebasket16}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[16]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[16]?  <button onClick={this.storebasket17}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[17]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[17]?  <button onClick={this.storebasket18}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[18]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[18]?  <button onClick={this.storebasket19}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[19]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[19]?  <button onClick={this.storebasket20}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[20]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[20]?  <button onClick={this.storebasket21}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>

                  <TableRow>
                    <TableCell><img src={this.props.basket[21]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[21]?  <button onClick={this.storebasket22}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[22]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[22]?  <button onClick={this.storebasket23}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[23]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[23]?  <button onClick={this.storebasket24}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                  <TableRow>
                    <TableCell><img src={this.props.basket[24]}  width='80'/></TableCell>
                    <TableCell>  {this.props.basket[24]?  <button onClick={this.storebasket25}>장바구니담기</button>   :null}  </TableCell>
                  
                  </TableRow>
                 
                   
     
              </TableBody>
             </Table>      
                          
                   
                                       {/*권한 안걸리는 이미지 로컬이미지가 basket[0]들어가있다면 crossOrigin검사를 통과해 제대로 표출될것이고, local이 아닌놈이 [0]에있다면 권한에러뜰것이다. }
                       
                     {   <img crossOrigin='anonymous' draggable ="true" src={this.props.basket[0]}  width='80' />
                        <button onClick={this.storebasket1}>장바구니담기</button>
                        <img crossOrigin='anonymous' draggable ="true" src={this.props.basket[1]}  width='80'/>
                        <button onClick={this.storebasket2} >장바구니담기</button>
                        <img crossOrigin='anonymous' draggable ="true" src={this.props.basket[2]}width='80' />
                        <button onClick={this.storebasket3}>장바구니담기</button>
                        <img crossOrigin='anonymous' draggable ="true" src={this.props.basket[3]} width='80'/>
                        <button onClick={this.storebasket4}>장바구니담기</button>
                                                {여기 크기설정도 영향이 있다!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! canvas안에 들어갈 이미지의 크기를 설정하므로 canvas에서 들어갈때의 크기를 img.width로 지정하면 img.width의 크기가 여기 img의 크기가됨*/} 
                    
                    </div>
                 
                   
                   {/* 무한정 넣을수 없게하여 5개만보여준다, 고로 버튼클릭했을때의 basket에 이미지들어가는부분도 갯수를 통제해야한다.(items.jsx확인해봐라)*/ }
               
                </div>

           
           
              
        );   
    }
}


  //은규가준 이미지 삽입 부분 JS part를 여기다 전역함수로 선언해줘서 사용한다.
  function initCanvas() {
    $(".canvas-container").each(function(index) {
      var canvasContainer = $(this)[0];
      var canvasObject = $("canvas", this)[0];
      var url = $(this).data("floorplan");
      
      canvas = (window._canvas = new fabric.Canvas(canvasObject,{backgroundColor:"#fff"}));  //이런식으로 backgroud설정가능


     
      canvas.setHeight(400); //캔버스의 크기설정할수 있음//캔버스의 높이설정 여기서 해줘야함
      canvas.setWidth(500);  //캔버스랑 배경 안겹치면 이숫자를 맞춰줘라
      // canvas.setBackgroundImage(url, canvas.renderAll.bind(canvas));
  
      var imageOffsetX, imageOffsetY;
  
      function handleDragStart(e) {  //넣을 이미지를 클릭하고 옮기는 딱 start시점에 발생
        // console.log('DragStart');
        [].forEach.call(images, function(img) {
          img.classList.remove("img_dragging");
        });
        this.classList.add("img_dragging");
  
        var imageOffset = $(this).offset();
        imageOffsetX = e.clientX - imageOffset.left;  //내가 놓은 위치에 이미지가 그 위치에 안착하게 도와주는부분
        imageOffsetY = e.clientY - imageOffset.top;
      }
  
      function handleDragOver(e) {   //넣을 이미지가 canvas위에서 자리이동할때 불리는함수
        // console.log('drag over');
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.dataTransfer.dropEffect = "copy";
        return false;
      }
  
      function handleDragEnter(e) {  //넣을 이미지가 canvas안에 들어가는 시점에서 발생되는 함수(start와는다름)
          // console.log('drag enter');
        this.classList.add("over");
      }
  
      function handleDragLeave(e) {  //넣을 이미지가 canvas에서 나오는 시점에서 발생되는함수
        // console.log('drag leave');
        this.classList.remove("over");
      }


      async function handleDrop(e) {    
        // console.log('drag drop');
        e = e || window.event;
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (e.stopPropagation) {
          e.stopPropagation();
        }
        var img = document.querySelector(".furniture img.img_dragging");
        
       // console.log("event: ", e);
      //  console.log(img);
        var offset = $(canvasObject).offset();
        var y = e.clientY - (offset.top + imageOffsetY); //내가 놓은 위치에 이미지가 그 위치에 안착하게 도와주는부분
        var x = e.clientX - (offset.left + imageOffsetX);
  
        var newImage = new fabric.Image(img, {//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1여기서 img란 밑에 삽입되길 기다리는 놈이 img를 의미함,위에서의  src={this.props.basket[0]} width='600' 이놈의 width통제받는다는말
         // width: img.width,   //  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!img.width    이부분존나중요!!!!!!!!!!이미지가 canvas에 들어가는순간 바뀌는 크기지정하는곳!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
         // height: img.height,  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!img.height    width랑 height을 600 , 600 으로 하면 보임, 사진이 짤리고 안짤리고는 이부분과, Testhome에 있는 이미지원본크기 이 둘사이의 상관관계에 의해 사진이 짤리고 안짤리고가결정남
          left: x,           //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1!!!!!!!!!!!!!!!!!!!!!!!!!Testhome에서 받는 원본이미지가 존나 크면 잘려나오고, 감당이 되는 사이즈가 주어지면 제대로나옴, 
          top: y                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Testhome의 원본이미지가 800 800크긴데 여기서 width 400 height 400 주면 짤려나오고
        });                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!Testhome이 800800 인데 여기서 width 800 hetight 800 주면 제대로 다나옴, 여기서 width height은 기준이 Lest ,Top 왼쪽윗꼭지점기준 width height이여서 원본이미지크기보다 작게 canvas에서 찍을경우 잘려나오는것임
        // newImage.setCrossOrigin('*')

        canvas.add(newImage);
         newImage.scaleToWidth(img.width)
         return false;
      }
  
     

  function handleDragEnd(e) {
        // console.log('Dragend');
        [].forEach.call(images, function(img) {
          img.classList.remove("img_dragging");
        });
      }
  
      var images = document.querySelectorAll(".furniture img");
      [].forEach.call(images, function(img) {
        img.addEventListener("dragstart", handleDragStart, false);
        img.addEventListener("dragend", handleDragEnd, false);
      });
 
      canvasContainer.addEventListener("dragenter", handleDragEnter, false);
      canvasContainer.addEventListener("dragover", handleDragOver, false);
      canvasContainer.addEventListener("dragleave", handleDragLeave, false);
      canvasContainer.addEventListener("drop", handleDrop, false);
    });
  }

  

  function deleteObjects(canvas){ //삭제하기
    var activeObject = canvas.getActiveObjects(),
        activeobjectGroup = new fabric.ActiveSelection(activeObject, {              //여러개 선택하면 삭제 안되니깐 새로 패브릭으로 만들어주고
        canvas: canvas                                                              // 그걸 통으로 지우는 방식
      });
      if (activeobjectGroup) {
        // console.log(activeobjectGroup);
        activeobjectGroup.forEachObject(function(obj) {
          //console.log(obj);
        canvas.remove(obj);
      });
      }
      else {
        //console.log("aaaaaaaaaaaaaaaaa");
        //console.log(activeObject);
        canvas.remove(activeObject);
     
      }
      canvas.discardActiveObject();
      canvas.requestRenderAll();
  }


  function getIndex(canvas){  //이미지 앞뒤 순서 자동으로 정해주는놈

   // console.log("aaa");
    var activeObj = canvas.getActiveObject();
    

    canvas.bringToFront(activeObj);                                                 
   // console.log(activeObj && canvas.getObjects().indexOf(activeObj));              
    return activeObj && canvas.getObjects().indexOf(activeObj)
   }

















