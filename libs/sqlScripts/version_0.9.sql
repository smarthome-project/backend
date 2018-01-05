ALTER TABLE `devices` 
ADD UNIQUE INDEX `input_id_UNIQUE` (`input_id` ASC);

UPDATE `info` SET `version` = '0.9';