ALTER TABLE `active_login` ADD UNIQUE(`user_id`);

ALTER TABLE `active_admin_login` ADD UNIQUE(`admin_id`);