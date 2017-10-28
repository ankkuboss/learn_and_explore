<html data-ng-app = "learn_and_explore">
<head>
    <script type="text/javascript">
    Object.defineProperty(window, 'site_url', {value:'<?php echo base_url();?>', writable:false});
    Object.defineProperty(window, 'base_url', {value:'<?php echo base_url();?>', writable:false});
    Object.defineProperty(window, 'AUTH_KEY', {value:'admin_session_key', writable:false});
    Object.defineProperty(window, 'FACEBOOK_ID', {value:'', writable:false});
    Object.defineProperty(window, 'NodeAddr', {value:'', writable:false});
    Object.defineProperty(window, 'SERVER_GLOBAL', {value:{}, writable:true});
    Object.defineProperty(window, 'currency_code', {value:'&#36;', writable:true});
    Object.defineProperty(window, 'DEFAULT_SALARY_UNIT', {value:'M', writable:true});
    Object.defineProperty(window, 'DEFAULT_SALARY_CAP', {value:'100', writable:true});
    Object.defineProperty(window, 'LANG_ABBR', {value:'en', writable:true});
            localStorage.setItem('web_language','english');
        
                
</script> 

  <script src="<?php echo BASE_APP_URL;?>explore_config/common.js"></script>
<base href="<?php echo base_url();?>"> 
<title >{{language.SITE_ADMIN_TITLE}}</title> 
<link href="<?php echo base_url();?>public/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="<?php echo base_url();?>public/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>public/css/nprogress.css" rel="stylesheet">
    <link href="<?php echo base_url();?>public/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>public/css/custom.min.css" rel="stylesheet">
    

  
<link id="load_plugins_before"/>
<style>
  
  .table-responsive{
    font-size: 11px !important;
  }
</style>
</head>
<body class="nav-md" ng-controller="CommonCtrl" ng-cloak>
<div class="container body">
    <div class="main_container">
    
        <div class="col-md-3 left_col" >
          <div class="left_col scroll-view">
            <div class="navbar nav_title" style="border: 0;">
              <a href="/" class="site_title"><i class="fa fa-paw"></i> <span>{{SITE_TITLE}}</span></a>
            </div>

            <div class="clearfix"></div>
            <!-- menu profile quick info -->
            <div data-ng-if="is_logged_in=='true'" class="profile clearfix">
              <!-- <div class="profile_pic">
                <img src="images/img.jpg" alt="..." class="img-circle profile_img">
              </div> -->
              <div class="profile_info">
                <span>Welcome,</span>
                <h2>Admin</h2>
              </div>
            </div>
            <!-- /menu profile quick info -->
            <br />
            
            <div data-ng-if="is_logged_in=='true'" id="sidebar-menu" class="main_menu_side hidden-print main_menu" ng-include="'<?php echo base_url();?>public/templates/sidebar/ba-sidebar.html'"></div>

            <!-- /menu footer buttons -->
            <div data-ng-if="is_logged_in=='true'" class="sidebar-footer hidden-small">
              <a data-toggle="tooltip" data-placement="top" title="Settings">
                <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="FullScreen">
                <span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="Lock">
                <span class="glyphicon glyphicon-eye-close" aria-hidden="true"></span>
              </a>
              <a data-toggle="tooltip" data-placement="top" title="Logout" data-ng-click="logout();" href="javascript:void(0);">
                <span class="glyphicon glyphicon-off" aria-hidden="true"></span>
              </a>
            </div>
            <!-- /menu footer buttons -->


            </div>

        </div>

                <!-- top navigation -->
        <div data-ng-if="is_logged_in=='true'" class="top_nav">
          <div class="nav_menu">
            <nav>
              <div class="nav toggle">
                <a id="menu_toggle"><i class="fa fa-bars"></i></a>
              </div>

              <ul class="nav navbar-nav navbar-right">
                <li class="">
                  <a href="javascript:;" class="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <img src="images/img.jpg" alt="">{{userName}}
                    <span class=" fa fa-angle-down"></span>
                  </a>
                  <ul class="dropdown-menu dropdown-usermenu pull-right">
                    <li><a href="javascript:;"> Profile</a></li>
                    <li>
                      <a href="javascript:;">
                        <span class="badge bg-red pull-right">50%</span>
                        <span>Settings</span>
                      </a>
                    </li>
                    <li><a href="javascript:;">Help</a></li>
                    <li><a href="javascript:void(0);" data-ng-click="logout();"><i class="fa fa-sign-out pull-right"></i> Log Out</a></li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <!-- /top navigation -->


        <div ng-repeat="alert in alerts"
        
         class="alert alert-{{alert.type}} alert-dismissable"
         >
          <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>
           {{alert.msg}}
        </div>  

 <!-- page content -->
        <div ui-view></div>

<!-- /page content -->

<!-- footer content -->
        <footer data-ng-if="is_logged_in=='true'">
          <div class="pull-right">
            
          </div>
          <div class="clearfix"></div>
        </footer>
        <!-- /footer content -->



    </div>
</div>
        

  <script src="<?php echo base_url();?>public/js/lib/jquery.min.js"></script>
    <script src="<?php echo base_url();?>public/js/lib/bootstrap.min.js"></script>
     <!-- <script src="<?php echo base_url();?>public/js/htmldev/main.js"></script> -->
    <script src="<?php echo base_url();?>public/js/lib/angular.min.js"></script>
    
<!-- <script src="https://code.angularjs.org/1.4.12/angular.js"></script>
 -->    <script src="<?php echo base_url();?>public/js/lib/angular-ui-router.min.js"></script>
    
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