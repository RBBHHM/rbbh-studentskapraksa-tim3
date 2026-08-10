INSERT INTO appraisal_orders
  (order_number, status, client_name, client_type, client_identifier, contact_name,
   contact_phone, contact_email, branch, city, property_address, created_by_user_id,
   created_by_role, created_by_name, created_by_email, title, internal_note, created_at,
   submitted_at, workflow_type, square_meters_residential, appraisal_fee)
VALUES
  ('PN-2026-00001', 0, 'Demo Klijent d.o.o.', 'Pravno lice', '4200000000001', 'Amina Demo', '+387 61 111 111', 'amina.demo@example.test', 'Sarajevo Centar', 'Sarajevo', 'Zmaja od Bosne 1', 'dpnpn.prodaja', 'AM', 'Demo Prodaja', 'prodaja@example.test', 'Procjena poslovnog prostora', 'Lokalni razvojni podatak', NOW() - INTERVAL '20 days', NULL, 0, NULL, NULL),
  ('PN-2026-00002', 1, 'Haris Primjer', 'Fizičko lice', '0101990170001', 'Haris Primjer', '+387 62 222 222', 'haris@example.test', 'Mostar', 'Mostar', 'Kralja Tomislava 12', 'dpnpn.prodaja', 'AM', 'Demo Prodaja', 'prodaja@example.test', 'Procjena stana', 'Predana narudžba', NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days', 0, 72.5, NULL),
  ('PN-2026-00003', 2, 'Demo Invest d.d.', 'Pravno lice', '4200000000003', 'Lejla Test', '+387 63 333 333', 'lejla@example.test', 'Tuzla', 'Tuzla', 'Maršala Tita 25', 'dpnpn.prodaja', 'AM', 'Demo Prodaja', 'prodaja@example.test', 'Procjena zemljišta', 'Čeka obradu', NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days', 1, NULL, NULL),
  ('PN-2026-00004', 3, 'Nermin Uzorak', 'Fizičko lice', '0202991170002', 'Nermin Uzorak', '+387 64 444 444', 'nermin@example.test', 'Banja Luka', 'Banja Luka', 'Kralja Petra I 44', 'dpnpn.prodaja', 'AM', 'Demo Prodaja', 'prodaja@example.test', 'Procjena kuće', 'Dodjela vještaka u toku', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', 0, 145.0, 450.00),
  ('PN-2026-00005', 4, 'Demo Logistika d.o.o.', 'Pravno lice', '4200000000005', 'Sara Lokal', '+387 65 555 555', 'sara@example.test', 'Zenica', 'Zenica', 'Industrijska zona 5', 'dpnpn.prodaja', 'AM', 'Demo Prodaja', 'prodaja@example.test', 'Procjena skladišta', 'Aktivna procjena', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 1, NULL, 900.00)
ON CONFLICT (order_number) DO NOTHING;
