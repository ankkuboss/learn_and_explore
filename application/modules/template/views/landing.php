<html data-ng-app = "learn_and_explore">
<head>
    <script type="text/javascript">
    Object.defineProperty(window, 'site_url', {value:'<?php echo base_url();?>', writable:false});
    Object.defineProperty(window, 'base_url', {value:'<?php echo base_url();?>', writable:false});
    Object.defineProperty(window, 'AUTH_KEY', {value:'session_key', writable:false});
    Object.defineProperty(window, 'FACEBOOK_ID', {value:'', writable:false});
    Object.defineProperty(window, 'NodeAddr', {value:'', writable:false});
    Object.defineProperty(window, 'SERVER_GLOBAL', {value:{}, writable:true});
    Object.defineProperty(window, 'currency_code', {value:'&#36;', writable:true});
    Object.defineProperty(window, 'DEFAULT_SALARY_UNIT', {value:'M', writable:true});
    Object.defineProperty(window, 'DEFAULT_SALARY_CAP', {value:'100', writable:true});
    Object.defineProperty(window, 'LANG_ABBR', {value:'en', writable:true});
            localStorage.setItem('web_language','english');
        
                
</script> 
<script type="text/javascript" src="<?php echo base_url();?>explore_config/common.js"></script>
<base href="<?php echo base_url();?>"> 
<title>{{language.SITE_TITLE}}</title> 
<!-- <link href="<?php echo base_url();?>public/css/bootstrap.min.css" rel="stylesheet"> -->
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link href="<?php echo base_url();?>public/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>public/css/style.css" rel="stylesheet">

  <link rel="shortcut icon" href="{{language.SITE_FAVICON}}" />
<link id="load_plugins_before"/>
<style>

#slides_control > div{
  height: 200px;
}
img{
  margin:auto;
  width: 400px;
}
#slides_control {
  position:absolute;
  width: 400px;
  left:50%;
  top:20px;
 margin-left:-200px;
}
</style>

<title>{{language.SITE_TITLE}}</title>
<meta name="description" content="<?php echo SITE_TITLE;?> a cashback website from most popular shopping website,earn cashback by shopping through <?php echo SITE_TITLE;?>.">
<meta name="keywords" content="offers,coupons,coupon,best deals,sale,mobile offers,electronic offers,recharge coupons,mobile offers,cashback offers,great deals,cashback,coupon codes,promo codes,discounts,deals">

<meta http-equiv="content-type" content="text/html;charset=UTF-8">

</head>
<body class="nav-md" ng-controller="CommonCtrl" ng-cloak>
<div class="left-ad">
  <a href="http://tracking.vcommission.com/aff_c?offer_id=1018&aff_id=63524&file_id=95098" target="_blank"><img style="width: 180px;position: fixed;"  src="http://media.vcommission.com/brand/files/vcm/1018/Ebay_ReachOpulent4GAtRs4299_160x600.jpg" width="160" height="600" border="0" /></a><img src="http://tracking.vcommission.com/aff_i?offer_id=1018&file_id=95098&aff_id=63524" width="1" height="1" />
</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-106139081-1', 'auto');
  ga('send', 'pageview');

</script>
<div class="container body">
    <div class="main_container">
    <nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div   ng-include="'<?php echo base_url();?>public/templates/home/header.html'"></div>


  </div><!-- /.container-fluid -->
</nav>
      
   
          <!--   <div data-ng-if="is_logged_in=='true'" id="sidebar-menu" class="main_menu_side hidden-print main_menu" ng-include="'<?php echo base_url();?>public/templates/sidebar/ba-sidebar.html'"></div> -->

        <div ng-repeat="alert in alerts"
        
         class="alert alert-{{alert.type}} alert-dismissable"
         >
          <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>
           {{alert.msg}}
        </div>    

         <!-- <div uib-alert ng-repeat="alert in alerts"  class="alert alert-dismissable alert-{{alert.type}}"    close="closeAlert($index)" dismiss-on-timeout=2000 > {{alert.msg}}</div>   -->   
 <!-- page content -->
        <div ui-view></div>

<!-- /page content -->
  <div   ng-include="'<?php echo base_url();?>public/templates/home/signup.html'"></div>
  <div   ng-include="'<?php echo base_url();?>public/templates/home/signin.html'"></div>
  <div   ng-include="'<?php echo base_url();?>public/templates/home/proceed_to_retailer.html'"></div>

<a href="http://tracking.vcommission.com/aff_c?offer_id=412&aff_id=63524&file_id=138636" target="_blank">
  <img class="footer-adv" src="http://media.vcommission.com/brand/files/vcm/412/Flipkart_CPS_Upto-40_Off_728X90.jpg" width="728" height="90" border="0" />
</a>
<img src="http://tracking.vcommission.com/aff_i?offer_id=412&file_id=138636&aff_id=63524" width="1" height="1" />
<footer class="container-fluid text-center">
  <p><?php echo SITE_TITLE;?> Copyright 2017</p>  
</footer>

    </div>
</div>
        

  <script src="<?php echo base_url();?>public/js/lib/jquery.min.js"></script>
    <script src="<?php echo base_url();?>public/js/lib/bootstrap.min.js"></script>
     <!-- <script src="<?php echo base_url();?>public/js/htmldev/main.js"></script> -->
    <script src="<?php echo base_url();?>public/js/lib/angular.min.js"></script>
    
<!-- <script src="https://code.angularjs.org/1.4.12/angular.js"></script>
 -->    <script src="<?php echo base_url();?>public/js/lib/angular-ui-router.min.js"></script>
   <!--  <script src="<?php echo base_url();?>public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script> -->
   <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.10.0/ui-bootstrap-tpls.min.js"></script>
    
     <script src="<?php echo base_url();?>public/js/lib/ocLazyLoad.min.js"></script>
    <script src="<?php echo base_url();?>public/js/lib/bootstrap-datepicker.js"></script>
    <script src="<?php echo base_url();?>public/js/lib/validate.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>public/js/lib/jgrowl.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>public/js/lib/jquery.mCustomScrollbar.concat.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>public/js/lib/scrollbars.min.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>public/js/lib/smartresize.js"></script>
    <script type="text/javascript" src="<?php echo base_url();?>public/js/lib/custom.js"></script>
    
    
    <script src="<?php echo base_url();?>public/js/app/app.js"></script>
    <script src="<?php echo base_url();?>public/js/app/controller/auth.js"></script>
    <script src="<?php echo base_url();?>public/js/app/controller/common.js"></script>
    
    <script src="<?php echo base_url();?>public/js/app/service/common_service.js"></script>
    <script src="<?php echo base_url();?>public/js/app/directive/directive.js"></script>


    <!-- <script type="text/javascript" src="<?php echo base_url();?>public/js/app/controller/common.js"></script>
 -->    <!-- <script src="<?php echo base_url();?>utility/javascript_var/common.js?2118004936"></script>
            <script src="<?php echo base_url();?>public/js/social/facebook_lib.js"></script>
        <script src="<?php echo base_url();?>public/js/social/twitter_lib.js"></script> -->
        
        <!-- all js ends here -->
</body>
</html>