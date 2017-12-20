CREATE OR REPLACE VIEW v_schedules AS
SELECT s.*, d.name ,r.name as room_name FROM schedules s
LEFT JOIN devices d on(s.device_id = d.id)
LEFT JOIN rooms r on (d.room_id = r.id);

UPDATE `info` SET `version` = '0.5';