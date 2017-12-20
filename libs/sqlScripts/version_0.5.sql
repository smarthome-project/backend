CREATE OR REPLACE VIEW v_schedules AS
SELECT s.id, s.device_id, s.cron, s.state, s.transiton_time, s.createdAt, s.updatedAt, s.active, r.id as room_id, d.name as device_name, r.name as room_name 
FROM schedules s
LEFT JOIN devices d on(d.id = s.device_id)
LEFT JOIN rooms r on (r.id = d.room_id);

UPDATE `info` SET `version` = '0.5';