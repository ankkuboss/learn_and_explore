<?php
$config = array( 
		"auth/signup"=> array(
			array(
                     'field'   => 'first_name', 
                     'label'   => 'First Name', 
                     'rules'   => 'required'
                  ),
               array(
                     'field'   => 'last_name', 
                     'label'   => 'Last Name', 
                     'rules'   => 'required'
                  ),
               array(
                     'field'   => 'email', 
                     'label'   => 'Email', 
                     'rules'   => 'required|valid_email|is_unique[user.email]'
                  ),   
               array(
                     'field'   => 'password', 
                     'label'   => 'Password', 
                     'rules'   => 'required'
                  ),
               array(
                     'field'   => 'dob', 
                     'label'   => 'Date of birth', 
                     'rules'   => 'required'
                  )
			),
      "auth/login" =>array(
              
               array(
                     'field'   => 'email', 
                     'label'   => 'Email', 
                     'rules'   => 'trim|required|valid_email'
                  ),   
               array(
                     'field'   => 'password', 
                     'label'   => 'Password', 
                     'rules'   => 'trim|required'
                  ),
         ),
       "myprofile/bank_details" =>array(
              
               array(
                     'field'   => 'account_holder_name', 
                     'label'   => 'Account holder name', 
                     'rules'   => 'trim|required'
                  ),   
               array(
                     'field'   => 'bank_name', 
                     'label'   => 'bank name', 
                     'rules'   => 'trim|required'
                  ),
                array(
                     'field'   => 'branch_name', 
                     'label'   => 'branch name', 
                     'rules'   => 'trim|required'
                  ),
                 array(
                     'field'   => 'account_number', 
                     'label'   => 'Acount Number', 
                     'rules'   => 'trim|required'
                  ),
                  array(
                     'field'   => 'ifsc_code', 
                     'label'   => 'IFSC code', 
                     'rules'   => 'trim|required'
                  ),
         ),
               
            );