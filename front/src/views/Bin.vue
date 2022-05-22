<template>

  <div>
    <div>
        <base-header type="gradient-default" class="pb-6 pb-8 pt-5 pt-md-6" style='height:30px;'>
        
            <div class="col-lg-5 col-md-6">
              <h1 class="text-white">Smart Food Waste Bin</h1>
              
            </div>
        </base-header>
    </div>
    
    
      <div class="col-xl-7">
      <!--
      <base-progress type="danger" :height="20" :value="model.CurTemp" label="Current Temperature"></base-progress>
      <base-progress type="primary" :height="20" :value="model2.CurTerm" label="Current Term"></base-progress>
      -->
      
      
      </div>
      <img src="img/brand/status.png" style="width:552px; height:400px;"/>
<div class="row">
          <!--
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Weight"
            type="gradient-red"
            sub-title="무게"
            icon="ni ni-active-40"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-success mr-2">
                <i class="fa fa-arrow-up"></i> 3.48%
              </span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </div>
        -->
        <div class="col-xl-1"></div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Amount"
            type="gradient-orange"
            sub-title="현재 양"
    
            icon="ni ni-chart-pie-35"
            class="mb-4 mb-xl-0"
            
          >
          
            <template v-slot:footer>
              <div role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
              <h4>{{model2.CurTerm}}ml</h4>
              <span class="text-nowrap">현재 쓰레기의 양은 {{model2.CurTerm}}ml 입니다.</span>
            
            </template>
            
            
          </stats-card>
        </div>
        
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Temperature"
            type="gradient-green"
            sub-title="현재 온도"
            icon="ni ni-money-coins"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <h4>{{model.CurTemp}}°C</h4>
              <span class="text-nowrap">현재 쓰레기통 내부 온도는 {{model.CurTemp}}°C 입니다.</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Term"
            type="gradient-info"
            sub-title="현재 주기"
            icon="ni ni-chart-bar-32"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <h4>{{model2.CurTerm}}분</h4>
              <span class="text-nowrap">{{model2.CurTerm}}분마다 한 번씩 탈취합니다.</span>
            </template>
          </stats-card>
        </div>
      </div>
      

      

  </div>
</template>

<script>

import axios from 'axios';



export default {

  data() {
    
    return {
      model:{
        CurAmount:"",
        CurTemp:"",
      },

      model2:{
        CurTerm:"",
      },

     
    
    };
  },
  
 
  

  created(){ // DB 데이터 로드
          console.log(this.model);
          let test2=axios.get('http://127.0.0.1:3000/bin_load').then((res)=>{
            this.model.CurTemp = res.data.Temp;
          })
          console.log(test2);

          console.log(this.model2);
        let test3=axios.get('http://127.0.0.1:3000/set_load').then((resp)=>{
         this.model2.CurTerm = resp.data.Term;
          document.documentElement.style.getPropertyValue("--value");
          document.documentElement.style.setProperty("--value", this.model2.CurTerm);
         console.log(resp.data.Term);
        })
        console.log(test3);
    },


  
};








</script>
<style>


:root {
    --value : 0;
}  



@keyframes growProgressBar {
  0%, 33% { --pgPercentage: 0; }
  100% { --pgPercentage: var(--value); }
}

@property --pgPercentage {
  syntax: '<number>';
  inherits: false;
  initial-value: 0;
}


div[role="progressbar"] {
  --size: 12rem;
  --fg: #369;
  --bg: #def;
  --pgPercentage: var(--value);
  animation: growProgressBar 3s 1 forwards;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: 
    radial-gradient(closest-side, white 80%, transparent 0 99.9%, white 0),
    conic-gradient(var(--fg) calc(var(--pgPercentage) * 1%), var(--bg) 0)
    ;
  font-family: Helvetica, Arial, sans-serif;
  font-size: calc(var(--size) / 5);
  color: var(--fg);
}

div[role="progressbar"]::before {
  counter-reset: percentage var(--value);
  content: counter(percentage) '%';
}


</style>

