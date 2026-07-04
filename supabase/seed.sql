insert into owner_profiles (display_name, fiscal_name, public_location, payout_status, verified)
values
('Ana Martins Campers', 'Ana Martins', 'Sintra, Lisboa', 'ativo', true),
('Costa Vicentina Vans', 'João Pereira', 'Lagos, Algarve', 'ativo', true),
('Douro Campers', 'Douro Campers Lda', 'Vila Nova de Gaia, Porto', 'pendente', false);

insert into vehicles (owner_id, slug, name, type, description, public_location, private_address, license_plate, price_from, seats, sleeps, gearbox, pets_allowed, included_km_per_day, deposit_amount, extra_km_price, fuel_policy, cleaning_policy, abroad_allowed, status)
values
((select id from owner_profiles where display_name = 'Ana Martins Campers'), 'serra-atlantica', 'Serra Atlântica', 'perfilada', 'Autocaravana confortável para viagens em família.', 'Sintra, Lisboa', 'Rua da Serra 12, Sintra', 'AA-00-AA', 92, 4, 4, 'Manual', true, 250, 1200, 0.28, 'Cheio-cheio', 'Devolver limpa', true, 'publicado'),
((select id from owner_profiles where display_name = 'Costa Vicentina Vans'), 'costa-vicentina', 'Costa Vicentina', 'campervan', 'Campervan ágil para duas pessoas.', 'Lagos, Algarve', 'Estrada da Meia Praia 8, Lagos', 'BB-00-BB', 74, 2, 2, 'Automática', false, 220, 900, 0.24, 'Cheio-cheio', 'Interior limpo', true, 'publicado'),
((select id from owner_profiles where display_name = 'Douro Campers'), 'douro-livre', 'Douro Livre', 'capucine', 'Autocaravana espaçosa para grupos e famílias.', 'Vila Nova de Gaia, Porto', 'Rua do Rio 31, Vila Nova de Gaia', 'CC-00-CC', 108, 6, 6, 'Manual', true, 300, 1400, 0.30, 'Cheio-cheio', 'Taxa de limpeza se necessário', false, 'pendente');

insert into vehicle_features (vehicle_id, name)
select id, feature
from vehicles
cross join unnest(array['Cozinha', 'Frigorífico', 'WC', 'Duche', 'Aquecimento', 'Painel solar']) as feature;

insert into vehicle_extras (vehicle_id, name, price, unit)
select id, 'Roupa de cama', 35, 'reserva' from vehicles
union all select id, 'Cadeira de criança', 20, 'reserva' from vehicles
union all select id, 'Transfer aeroporto', 55, 'reserva' from vehicles;

insert into vehicle_availability_blocks (vehicle_id, start_date, end_date, reason)
select id, '2026-07-12', '2026-07-18', 'Reserva confirmada' from vehicles where slug = 'serra-atlantica'
union all select id, '2026-07-20', '2026-07-24', 'Uso próprio' from vehicles where slug = 'costa-vicentina'
union all select id, '2026-09-01', '2026-09-08', 'Reserva confirmada' from vehicles where slug = 'douro-livre';

insert into settings (company_name, email, phone, whatsapp, address, iban, terms, cancellation_policy, privacy_policy)
values ('Rota Livre', 'reservas@rotalivre.pt', '+351 900 000 000', '+351 900 000 000', 'Portugal', 'PT50 0000 0000 0000 0000 0000 0', 'Condições gerais de aluguer.', 'Política de cancelamento configurável.', 'Política de privacidade configurável.');
