ALTER TABLE pin_settings ADD shift_id int(11) UNSIGNED NOT NULL;

INSERT INTO info(version) VALUES('0.4');
