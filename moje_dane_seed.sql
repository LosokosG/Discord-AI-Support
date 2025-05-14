--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

INSERT INTO _realtime.tenants (id, name, external_id, jwt_secret, max_concurrent_users, inserted_at, updated_at, max_events_per_second, postgres_cdc_default, max_bytes_per_second, max_channels_per_client, max_joins_per_second, suspend, jwt_jwks, notify_private_alpha, private_only) VALUES ('e9d4959e-98c1-4fd3-8710-b7a283436d7f', 'realtime-dev', 'realtime-dev', 'iNjicxc4+llvc9wovDvqymwfnj9teWMlyOIbJ8Fh6j2WNU8CIJ2ZgjR6MUIKqSmeDmvpsKLsZ9jgXJmQPpwL8w==', 200, '2025-05-14 11:28:42', '2025-05-14 11:28:42', 100, 'postgres_cdc_rls', 100000, 100, 100, false, '{"keys": [{"k": "c3VwZXItc2VjcmV0LWp3dC10b2tlbi13aXRoLWF0LWxlYXN0LTMyLWNoYXJhY3RlcnMtbG9uZw", "kty": "oct"}]}', false, false);


--
-- Data for Name: extensions; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

INSERT INTO _realtime.extensions (id, type, settings, tenant_external_id, inserted_at, updated_at) VALUES ('84bfe4aa-bf61-4310-84c4-dea5847f9815', 'postgres_cdc_rls', '{"region": "us-east-1", "db_host": "d/GUCPVeZvFW7KDvswTBqt3G4gdLAW/pMSSshiXaIiY=", "db_name": "sWBpZNdjggEPTQVlI52Zfw==", "db_port": "+enMDFi1J/3IrrquHHwUmA==", "db_user": "uxbEq/zz8DXVD53TOI1zmw==", "slot_name": "supabase_realtime_replication_slot", "db_password": "sWBpZNdjggEPTQVlI52Zfw==", "publication": "supabase_realtime", "ssl_enforced": false, "poll_interval_ms": 100, "poll_max_changes": 100, "poll_max_record_bytes": 1048576}', 'realtime-dev', '2025-05-14 11:28:42', '2025-05-14 11:28:42');


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: _realtime; Owner: supabase_admin
--

INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20210706140551, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220329161857, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220410212326, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220506102948, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220527210857, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220815211129, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220815215024, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20220818141501, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20221018173709, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20221102172703, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20221223010058, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20230110180046, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20230810220907, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20230810220924, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20231024094642, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20240306114423, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20240418082835, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20240625211759, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20240704172020, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20240902173232, '2025-05-01 19:39:55');
INSERT INTO _realtime.schema_migrations (version, inserted_at) VALUES (20241106103258, '2025-05-01 19:39:55');


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3224b79c-8bfa-43ad-b38c-b4cfd5710aa8', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"losokosg@proton.me","user_id":"0204e012-5d8f-4ad0-87a4-b94d228fea14","user_phone":""}}', '2025-05-01 19:49:43.487512+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '420b19d0-3750-4dc4-ad5f-4d9b38836015', '{"action":"user_signedup","actor_id":"9820deaf-bfef-43d7-b26e-b48b48b01fd4","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2025-05-02 11:58:57.252666+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '47ca6b8f-fcd8-40df-96fe-83b911d853d4', '{"action":"login","actor_id":"9820deaf-bfef-43d7-b26e-b48b48b01fd4","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:06:26.457705+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7d09ad9f-5de8-4bd7-8e12-992798529a4d', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"immaplayman@gmail.com","user_id":"9820deaf-bfef-43d7-b26e-b48b48b01fd4","user_phone":""}}', '2025-05-05 19:08:48.10436+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f8c980b8-ec16-4c10-bcf6-9c3d67675ab9', '{"action":"user_signedup","actor_id":"ddca067b-b19a-45a8-b612-0b5d66cf4f28","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2025-05-05 19:10:13.869401+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'adbbe508-bb9d-4a02-b61d-e6b425018839', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"immaplayman@gmail.com","user_id":"ddca067b-b19a-45a8-b612-0b5d66cf4f28","user_phone":""}}', '2025-05-05 19:10:40.590646+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '74f59917-4bd2-4d3a-bcf9-4901aa6c8f47', '{"action":"user_signedup","actor_id":"bcc2146d-748a-4c91-8ef3-6ddd69f8f111","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2025-05-05 19:18:46.707223+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd93e8401-d80e-47b8-8f92-722a83a04e60', '{"action":"login","actor_id":"bcc2146d-748a-4c91-8ef3-6ddd69f8f111","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:19:05.499179+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '80cd1287-a93c-4e31-a454-7ea20d62f4f6', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"immaplayman@gmail.com","user_id":"bcc2146d-748a-4c91-8ef3-6ddd69f8f111","user_phone":""}}', '2025-05-05 19:23:18.491111+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '70d6a22c-b44b-46ac-bc21-be19f4712371', '{"action":"user_signedup","actor_id":"8fa84344-2292-41b7-bdeb-bacc812591bf","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2025-05-05 19:23:26.603129+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4f528d77-7b27-48bb-9bb9-e6a20b273aa1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"immaplayman@gmail.com","user_id":"8fa84344-2292-41b7-bdeb-bacc812591bf","user_phone":""}}', '2025-05-05 19:32:18.507099+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '012036e8-1501-43bd-bdbc-9613e9c1fa66', '{"action":"user_signedup","actor_id":"5b3d6b6c-9d35-479e-9efa-e855c41c30ac","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2025-05-05 19:32:31.72432+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2b3627a7-1ceb-4e11-b01e-cff80803c9c2', '{"action":"login","actor_id":"5b3d6b6c-9d35-479e-9efa-e855c41c30ac","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:40:02.656111+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b3d4db6b-1b1c-457c-b234-ab65b338a1af', '{"action":"login","actor_id":"5b3d6b6c-9d35-479e-9efa-e855c41c30ac","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:45:31.894572+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '67a5bba7-b4de-4bbf-bb0c-ad9608c613a6', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"immaplayman@gmail.com","user_id":"5b3d6b6c-9d35-479e-9efa-e855c41c30ac","user_phone":""}}', '2025-05-05 19:45:39.7974+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '73b483b4-41c9-4ddc-bc28-9485e2f65312', '{"action":"user_signedup","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2025-05-05 19:46:35.497578+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f819a0e9-c6ed-4a42-a745-cc1fc62f0971', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:48:11.026748+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd1f44511-1009-4385-874d-7b221c17cb85', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:52:20.839851+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '72bf3022-264f-4809-b0a9-155dbb826a3e', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-05 19:52:20.939199+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '671af1de-a365-48fd-a5c9-3cbd48e9b382', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 19:52:54.23254+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'bfb9d92e-72e0-441b-b0da-9f4b8cb98732', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-05 19:52:54.26494+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8bc65a26-1cc9-44bc-b2f6-42601ada2592', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-05 20:25:10.801609+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '8b4270fb-fb63-4623-9e64-568435059645', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 20:25:25.029209+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd26a1c9b-8fab-41d6-9bf3-3bf75d8a8566', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-05 20:25:25.055549+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ea24d7eb-d2ab-45bd-96ee-ef3b622bc28e', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 21:10:41.468167+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '08b1dd84-9372-4018-ae43-1c3fcc4ea88e', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-05 21:10:41.557291+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'a090c58a-2371-458e-82f7-117a58d65a16', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-05 21:45:42.768817+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c76ed416-df6b-4fac-8982-8db6e0c9ba0d', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-05 21:46:00.384582+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ccf19f0a-7aa7-406c-a828-bef4bc488079', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-05 21:46:00.415766+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '971a2018-28ea-414f-b4f3-0d74f6a3abe9', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 14:01:14.262138+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4a800368-d949-4b87-85a9-b4f0297fa0ad', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 14:01:14.268206+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '48c695a2-31a1-4b6a-8a0f-4b0d808e4d0a', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 14:01:32.507206+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c4edeb96-b38d-4322-a912-034b2a3e3782', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 14:01:33.172877+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '61e7e27b-f857-436e-85be-d8d73fbbba91', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 14:02:44.40162+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '29b48367-12e5-4871-bce6-4ef2a673e445', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 14:02:51.5644+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e7ee2a8f-a7de-4198-a7e9-9320ee19e069', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 14:02:51.597219+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3be32ead-a567-4d06-a390-87a76bcc7051', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 15:02:35.165894+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '79aec186-8081-499d-ac8c-fdd54f8caee2', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 15:02:35.170805+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '76c6d0df-c26c-4cc0-b545-4e2e12783123', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 15:02:35.209125+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'eca48619-2784-4e77-b6a5-5c70e6f29150', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 15:02:53.447632+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '0108ed68-26e7-48d6-a7b7-0cc56fb3da65', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 15:03:01.376839+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '223ecb6e-6812-42a8-a3cc-11135a4b655f', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 15:03:01.412751+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '864a36db-3d2a-49d2-aed5-afb3e4ee5203', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.723104+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cc9f17d3-26a2-4270-8903-c2d88b34c244', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.730367+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd2b9ad36-bb25-42ec-bc2f-db78bd69a539', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.749714+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '46cdcba9-5ed1-4c35-bfda-0010cade6adc', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.757842+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7b3a54f0-8b39-4666-ab73-aaa4094c4c89', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.797794+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '795d784e-dcf0-4bc2-af0a-98246866f658', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.808459+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ace0a741-1e57-4159-b3e9-8d767fcbbcb3', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 16:03:46.820786+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'e19405a4-d84b-44c9-b270-95f07d03fde1', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 16:08:42.298817+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '9284a949-e4e3-40a5-9acd-5e4ca6beec84', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 16:08:54.341221+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '14be113a-ef5b-4160-a9fc-b07b167d6bf6', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 16:08:54.392423+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd5b2e38e-379f-46dd-9f83-7e137b9eb7cf', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 17:33:34.554794+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '04dfe50f-f304-454b-856f-e93b054699da', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 17:33:34.567156+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ca3eed27-9a09-4113-b390-c2cf08d705ec', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 17:33:34.609536+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6a87aa9e-943b-42e1-8898-c4191c1b38b3', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 17:33:35.903919+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '672b7ddf-98fb-4e20-9e3b-bdba7389b277', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 17:33:35.942686+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f26ba18c-3421-45e4-832e-1123dd06dd46', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 19:36:15.052705+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fab42bff-7fcf-47dc-b04d-b6aece39ecd0', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 19:36:15.326046+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '407349ff-fb8e-475d-ac57-28485072bbfc', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 19:36:15.336746+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4facfbd3-005a-4003-b624-a944492dbc07', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 19:43:24.657493+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4ac037fa-f0c5-48d5-b8d1-717ef4e3e31b', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 19:43:39.341475+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '145725ad-91c1-45bb-a8b0-005449cb17e2', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 19:43:39.390579+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'dac713d9-2f5f-461c-8fe5-5ed3c0d99f08', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 21:50:30.624009+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ecbc42f7-fa92-4fdb-9b90-e2e502fb2c75', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 21:50:30.636401+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6924c293-be1e-4fee-80be-753b0752fa15', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 21:50:31.492464+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b58ab3c6-c2e1-44aa-bab1-a26db5ed9813', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 21:50:49.342867+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '05432f25-3901-4078-a834-5fc287cb1697', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 21:50:55.051747+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '16aa5345-f930-4bd3-a1bb-ae5068def632', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 21:50:55.093123+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '47e249c1-d82c-4c65-8f84-a9a030fbb104', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 23:15:56.021626+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '692de17c-e988-42f2-9fb5-f8064753d023', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 23:16:02.306527+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'da8be42c-2c92-40b7-a420-aa10259af334', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 23:16:02.356472+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2d42345b-f221-4047-a5d2-74e1d6b00580', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 18:35:07.558668+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '94d39a30-1d2a-4f13-bd88-417f13773c59', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 18:35:07.563159+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'fede955e-bbc8-42a9-ac24-d4f5f510c0e0', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 18:35:07.841809+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '5771cbf3-af85-493e-9147-b99711c53c23', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 18:35:58.049988+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '68f8d7e8-1a26-49b5-b7b2-96a94c28076a', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-06 18:36:04.716273+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2d3612b6-0b8b-4205-99d8-a38267ccba79', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-06 18:36:04.745647+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '46073ec2-2c16-4d5f-a870-6bb68c11c60a', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 19:36:15.000578+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '37b0f1b4-852c-45d2-b51d-8f55ac41203b', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 19:36:15.008352+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3d0d2db2-c1fa-4ec4-a7ef-55d64e36fd11', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 22:59:58.643298+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6bc87f5c-a8a1-47cd-9f95-ee49b8185724', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-06 22:59:58.651224+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'd4bafd4f-766b-42f6-83dd-7cdb2dc24c02', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-06 23:15:56.000983+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4f3978a1-6c61-4d25-9cad-ebb91cdd5233', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 15:24:35.188548+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cb91a7f5-307c-47a6-ad9d-e05cfa370c02', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 15:24:35.190268+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2bef0cd8-5f3d-43ec-b089-42950b11f1ac', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 15:24:35.724931+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'cd3fa6ac-da26-4069-a0d3-169af7bc9db1', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-08 15:24:43.901616+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'ec74cdeb-8fe1-4e43-8df9-fa212ea6525d', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-08 15:24:52.335636+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c5b74007-ad6d-4e28-afa2-f40263c88267', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-08 15:24:52.383269+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '938fe5cc-3881-4d88-a2d4-bce2bfa78132', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 16:23:59.127902+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2d50cb4f-8568-4916-9daa-5a0fbc26921e', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 16:23:59.139773+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '649ef498-7d43-4f58-879c-b8fec8173e56', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 17:24:30.454046+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '4e3eb89a-e62d-4b55-b756-19ef00745dc7', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 17:24:30.458693+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1fda4b88-dd5d-494d-9c42-e36a5141eca9', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 18:23:56.078184+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'b8564aa7-0b93-4647-8d10-4a9eb848b81c', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-08 18:23:56.083682+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '2692074b-a6e2-48ab-9e3a-88cbb8e135bd', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-08 19:21:10.637686+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f5e86beb-aff8-461c-ba33-a32054265795', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-08 19:21:20.99007+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '1ce33161-7a06-4a3e-8c1c-14af841f4706', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-08 19:21:21.074238+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3223badc-94c5-44f9-838f-ee39b98906a6', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-08 20:15:54.65426+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6fe18e8b-5434-4f7a-9cda-461f020eff1f', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-08 20:16:03.866795+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'f756538b-cbf3-44ce-9906-7cfe10df2f2c', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-08 20:16:03.906618+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3c7aabb9-735f-4214-9134-d8eba9866895', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-08 20:20:16.295844+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', 'c4001816-c5fd-497b-a651-2b1c9d98e362', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-08 20:20:27.338191+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '6417a0c7-bee1-4b53-a617-4cc2afb4d8c9', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-08 20:20:27.404979+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '09944f08-b220-44f9-bb47-d862ec9d2ce3', '{"action":"logout","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-05-08 20:31:16.26361+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '769eed5e-fd9f-4870-b3cd-8ca8e5aa7a11', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-08 20:31:23.725509+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '72c69c5e-691f-4d22-ba11-2e9d5f4f8077', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2025-05-08 20:31:23.748267+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3334c4d1-3bb5-4eef-845c-26d93c701114', '{"action":"login","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"discord"}}', '2025-05-13 12:12:38.134145+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '56e27ec6-5e32-4ff9-8459-edd1a6f852a4', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-13 12:12:38.343807+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '7bde259a-ec18-45df-81a9-a83cf707348f', '{"action":"token_revoked","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-13 12:12:38.344114+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '616f3da4-69db-4df2-8226-ca826dc6f0bb', '{"action":"token_refreshed","actor_id":"44d6abb0-edc1-47c2-a736-4bc5b5b4345e","actor_name":"losokos","actor_username":"immaplayman@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-05-13 12:12:38.799254+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('9142ebd7-5885-4f35-a5c7-719f7188d139', '9820deaf-bfef-43d7-b26e-b48b48b01fd4', 'd0c68db0-42fd-4e1a-8a63-db9fff6e326a', 's256', 'ALCb7rTQU8hPAAXZOsypIDMvhgd15jjRV4bvFjVo5x8', 'discord', 's573XOYD6syKIiderug0nwsxp3DtPU', 'DsdZoAjwWjFcenvTM3SI62DV2lyfqS', '2025-05-05 19:06:20.29563+00', '2025-05-05 19:06:26.46001+00', 'oauth', '2025-05-05 19:06:26.459933+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('3b3c49d8-f26f-4118-b1e1-468b35917a41', 'ddca067b-b19a-45a8-b612-0b5d66cf4f28', '10542f6e-9d52-44f5-81ec-b961e6c4d94a', 's256', 'lvRGDGIBYsS4b7i7a39yiLhj73zkSUaWN6bhlc_q7rs', 'discord', 'PJBjduEDtg9iWh1X0nvgzb1vAm5bgY', 'ZJCKbA3elqz4xH4DSCDN5w2DqYZAlq', '2025-05-05 19:10:08.841404+00', '2025-05-05 19:10:13.871657+00', 'oauth', '2025-05-05 19:10:13.871632+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('31cc7312-ae6c-4e40-9610-b97df7e0a9ff', 'bcc2146d-748a-4c91-8ef3-6ddd69f8f111', 'fe125aff-b40b-4fcb-a02f-c0a7a1f75ceb', 's256', 'qd_4XSTOH1RbKacNxKI9bxnHffuaaz729RNmlnghOJg', 'discord', 'xvbD4OsOWpF0WSfFiDec8XovrdZHhj', '7kWLAm3NUsu3BCJrX71f57cBEzhL49', '2025-05-05 19:18:41.138808+00', '2025-05-05 19:18:46.708364+00', 'oauth', '2025-05-05 19:18:46.708342+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('d08f2282-06f6-4500-81fb-49d17994c18b', 'bcc2146d-748a-4c91-8ef3-6ddd69f8f111', '1539bc27-040a-43fb-b6c0-3b22d4d60d93', 's256', '6mBMilEVG474F505V0ytc6GZ8ssesUaSTHbjpOaZygE', 'discord', '67SYThOjn9jD1GASkghuq2UTWmjN1Q', 'yWHOs3KQZuGuIB2WY0HTLmXQgJr3nX', '2025-05-05 19:19:00.200083+00', '2025-05-05 19:19:05.500452+00', 'oauth', '2025-05-05 19:19:05.500382+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('fa53908f-22da-4d09-b7e2-1031aa41c7e3', '8fa84344-2292-41b7-bdeb-bacc812591bf', '8ed1a86a-bd88-4819-acf4-e3e5f3460538', 's256', 'a_6tCj1PoaQH704-AajM2wQfCuxKd1D4bmwF95IY9Xo', 'discord', 'f8zz7o0V2zYSA3SJAUPucYSuw59ThV', '4Nn6OUCQxCMTUMX4e49nmpfI8fW0t2', '2025-05-05 19:23:21.881003+00', '2025-05-05 19:23:26.607032+00', 'oauth', '2025-05-05 19:23:26.606537+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('d67de31f-9840-4066-a3a5-f5775d9896f4', '5b3d6b6c-9d35-479e-9efa-e855c41c30ac', '866916c2-a4c9-4db4-85b2-f887b8789abb', 's256', '5wILz1uaqm9S4G43bCA9MHKi-kMs2CwrlPKiCXtFB8A', 'discord', 'Cpyg3ovmYizJhTsFFKSyyO6qxt3E21', '69vorEZchhTEeQru9gV7CtcrlXgoBl', '2025-05-05 19:32:21.083183+00', '2025-05-05 19:32:31.732101+00', 'oauth', '2025-05-05 19:32:31.73202+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('fd8787cd-eacb-4070-96f7-d4adfa7d0cff', '5b3d6b6c-9d35-479e-9efa-e855c41c30ac', 'f695a4fc-805d-4498-bdb3-4e0055df701c', 's256', 'R5l-mqwvhfrUUnzJ1Cvd9aLiplBRNGRDrt3vQFWQhpU', 'discord', 'gWU0br8DxKhZDMmjd2zoy10oBi2SG0', '7bs07pqVFyzILZdMRYZK6Dcdue1JTg', '2025-05-05 19:39:57.947315+00', '2025-05-05 19:40:02.656817+00', 'oauth', '2025-05-05 19:40:02.656797+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('f5533281-c053-44a3-ad93-0206bac21f3f', '5b3d6b6c-9d35-479e-9efa-e855c41c30ac', '0b1039a3-8d79-4ead-97cd-04fb903fc335', 's256', 'ak0HfYh3kTOkgyheOWZYrOylgMEd7uDVLt8qPXvHsdg', 'discord', 'USpqZQLPa3mLfWx9A59pz83l4QQqV9', 'f6iYLUu9VQssGfuA4zGV96goRnAG5F', '2025-05-05 19:45:26.759227+00', '2025-05-05 19:45:31.895098+00', 'oauth', '2025-05-05 19:45:31.89505+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('51d194aa-847c-4b8d-a3e5-996b925c9520', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '5ee2c150-c3bf-4f21-8e9a-b945cbeade5c', 's256', 'KjaSaRCGIEVDcoWNJpDGLE1s2YLMy_FsrHuF0ks9HYg', 'discord', 'm5vYy7VCHAiQMt3ROnXcVYDLdO8GSx', 'FV6IjW9QItHatOokVugkNzmiMn97n7', '2025-05-05 19:46:31.071649+00', '2025-05-05 19:46:35.500298+00', 'oauth', '2025-05-05 19:46:35.500239+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('359cc959-8bac-4540-a2bc-2bd3414160ad', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', 'ed6aa809-8fe6-4d69-9ce2-bc088d93bc2f', 's256', 'AyPnWoUHS2SLgk025MTB06-TT8s_ThloY_bj2al_jHE', 'discord', 'BfH8WgfsP4JOyKnc57aWlUVgLig2PI', 'dMmBLpahNCm7AGghzGeDJLM5n0N6j3', '2025-05-05 19:47:03.117337+00', '2025-05-05 19:48:11.027147+00', 'oauth', '2025-05-05 19:48:11.027124+00');
INSERT INTO auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) VALUES ('5739a547-610d-43c9-93af-2fe0ee11b8e1', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', 'bb7f5707-b118-4974-8266-a978e2591f64', 's256', 'eCK6XoaHHWIJFmY9B5-eDB5hk1ZNHUReTPVSgNe6pmg', 'discord', 'OV5svZ7E1hH8cs793i2gacqtL3tTKO', 'QRjvx4nsuOw58V0GtK0W3qIYk3cD7L', '2025-05-13 12:12:30.629475+00', '2025-05-13 12:12:38.137559+00', 'oauth', '2025-05-13 12:12:38.137535+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES (NULL, '00000000-0000-0000-0000-000000000000', NULL, NULL, 'test@example.com', '$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '2025-05-01 19:40:02.20327+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"name": "Test User"}', NULL, NULL, NULL, NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '0204e012-5d8f-4ad0-87a4-b94d228fea14', 'authenticated', 'authenticated', 'losokosg@proton.me', '$2a$10$x.wnc60NgfFVULPhV/FZG.WvvlsciPJYepIKknW.BvnSHTgWz/EW2', '2025-05-01 19:49:43.489485+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-05-01 19:49:43.47793+00', '2025-05-01 19:49:43.490685+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);
INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) VALUES ('00000000-0000-0000-0000-000000000000', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', 'authenticated', 'authenticated', 'immaplayman@gmail.com', NULL, '2025-05-05 19:46:35.498048+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-05-08 20:31:23.748906+00', '{"provider": "discord", "providers": ["discord"]}', '{"iss": "https://discord.com/api", "sub": "587059393766359041", "name": "losokos#0", "email": "immaplayman@gmail.com", "picture": "https://cdn.discordapp.com/avatars/587059393766359041/fb89f70f3f01c808014ffb80ee09d9ae.png", "full_name": "losokos", "avatar_url": "https://cdn.discordapp.com/avatars/587059393766359041/fb89f70f3f01c808014ffb80ee09d9ae.png", "provider_id": "587059393766359041", "custom_claims": {"global_name": "Losokos"}, "email_verified": true, "phone_verified": false}', NULL, '2025-05-05 19:46:35.494445+00', '2025-05-13 12:12:38.345809+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('0204e012-5d8f-4ad0-87a4-b94d228fea14', '0204e012-5d8f-4ad0-87a4-b94d228fea14', '{"sub": "0204e012-5d8f-4ad0-87a4-b94d228fea14", "email": "losokosg@proton.me", "email_verified": false, "phone_verified": false}', 'email', '2025-05-01 19:49:43.485838+00', '2025-05-01 19:49:43.485898+00', '2025-05-01 19:49:43.485898+00', 'c79f354f-d13d-47ae-bbd0-6f6bc3ce57bd');
INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) VALUES ('587059393766359041', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '{"iss": "https://discord.com/api", "sub": "587059393766359041", "name": "losokos#0", "email": "immaplayman@gmail.com", "picture": "https://cdn.discordapp.com/avatars/587059393766359041/fb89f70f3f01c808014ffb80ee09d9ae.png", "full_name": "losokos", "avatar_url": "https://cdn.discordapp.com/avatars/587059393766359041/fb89f70f3f01c808014ffb80ee09d9ae.png", "provider_id": "587059393766359041", "custom_claims": {"global_name": "Losokos"}, "email_verified": true, "phone_verified": false}', 'discord', '2025-05-05 19:46:35.495933+00', '2025-05-05 19:46:35.495957+00', '2025-05-13 12:12:38.129421+00', 'fb81c36b-ec01-47bd-814b-eeeeca3b0a2e');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) VALUES ('303d4f7a-55a2-477a-bdf2-2f6328657244', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 20:31:23.748965+00', '2025-05-13 12:12:38.801258+00', NULL, 'aal1', NULL, '2025-05-13 12:12:38.801158', 'node', '172.18.0.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) VALUES ('303d4f7a-55a2-477a-bdf2-2f6328657244', '2025-05-08 20:31:23.750606+00', '2025-05-08 20:31:23.750606+00', 'oauth', '43094ee3-23a8-46fb-87ab-33fe7f8e8666');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 30, 'mW9EU2g4asDYQTGn06MibA', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', true, '2025-05-08 20:31:23.749711+00', '2025-05-13 12:12:38.344378+00', NULL, '303d4f7a-55a2-477a-bdf2-2f6328657244');
INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 31, '4cEQVc5KwYFaCb1JvQLIcw', '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', false, '2025-05-13 12:12:38.344848+00', '2025-05-13 12:12:38.344848+00', 'mW9EU2g4asDYQTGn06MibA', '303d4f7a-55a2-477a-bdf2-2f6328657244');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.schema_migrations (version) VALUES ('20171026211738');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211808');
INSERT INTO auth.schema_migrations (version) VALUES ('20171026211834');
INSERT INTO auth.schema_migrations (version) VALUES ('20180103212743');
INSERT INTO auth.schema_migrations (version) VALUES ('20180108183307');
INSERT INTO auth.schema_migrations (version) VALUES ('20180119214651');
INSERT INTO auth.schema_migrations (version) VALUES ('20180125194653');
INSERT INTO auth.schema_migrations (version) VALUES ('00');
INSERT INTO auth.schema_migrations (version) VALUES ('20210710035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210722035447');
INSERT INTO auth.schema_migrations (version) VALUES ('20210730183235');
INSERT INTO auth.schema_migrations (version) VALUES ('20210909172000');
INSERT INTO auth.schema_migrations (version) VALUES ('20210927181326');
INSERT INTO auth.schema_migrations (version) VALUES ('20211122151130');
INSERT INTO auth.schema_migrations (version) VALUES ('20211124214934');
INSERT INTO auth.schema_migrations (version) VALUES ('20211202183645');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185221');
INSERT INTO auth.schema_migrations (version) VALUES ('20220114185340');
INSERT INTO auth.schema_migrations (version) VALUES ('20220224000811');
INSERT INTO auth.schema_migrations (version) VALUES ('20220323170000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220429102000');
INSERT INTO auth.schema_migrations (version) VALUES ('20220531120530');
INSERT INTO auth.schema_migrations (version) VALUES ('20220614074223');
INSERT INTO auth.schema_migrations (version) VALUES ('20220811173540');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041349');
INSERT INTO auth.schema_migrations (version) VALUES ('20221003041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221011041400');
INSERT INTO auth.schema_migrations (version) VALUES ('20221020193600');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021073300');
INSERT INTO auth.schema_migrations (version) VALUES ('20221021082433');
INSERT INTO auth.schema_migrations (version) VALUES ('20221027105023');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221114143410');
INSERT INTO auth.schema_migrations (version) VALUES ('20221125140132');
INSERT INTO auth.schema_migrations (version) VALUES ('20221208132122');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195500');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195800');
INSERT INTO auth.schema_migrations (version) VALUES ('20221215195900');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124310');
INSERT INTO auth.schema_migrations (version) VALUES ('20230116124412');
INSERT INTO auth.schema_migrations (version) VALUES ('20230131181311');
INSERT INTO auth.schema_migrations (version) VALUES ('20230322519590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230402418590');
INSERT INTO auth.schema_migrations (version) VALUES ('20230411005111');
INSERT INTO auth.schema_migrations (version) VALUES ('20230508135423');
INSERT INTO auth.schema_migrations (version) VALUES ('20230523124323');
INSERT INTO auth.schema_migrations (version) VALUES ('20230818113222');
INSERT INTO auth.schema_migrations (version) VALUES ('20230914180801');
INSERT INTO auth.schema_migrations (version) VALUES ('20231027141322');
INSERT INTO auth.schema_migrations (version) VALUES ('20231114161723');
INSERT INTO auth.schema_migrations (version) VALUES ('20231117164230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240115144230');
INSERT INTO auth.schema_migrations (version) VALUES ('20240214120130');
INSERT INTO auth.schema_migrations (version) VALUES ('20240306115329');
INSERT INTO auth.schema_migrations (version) VALUES ('20240314092811');
INSERT INTO auth.schema_migrations (version) VALUES ('20240427152123');
INSERT INTO auth.schema_migrations (version) VALUES ('20240612123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240729123726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240802193726');
INSERT INTO auth.schema_migrations (version) VALUES ('20240806073726');
INSERT INTO auth.schema_migrations (version) VALUES ('20241009103726');


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: billing_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: servers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.servers (id, name, icon_url, config, created_at, updated_at, active, plan_id) VALUES ('1116582282380189789', 'BullX', NULL, '{"enabled": false, "channels": [], "language": "en", "system_prompt": "You are a helpful AI assistant for this Discord server.", "max_text_length": 2000, "support_role_id": null, "max_messages_per_user": 10}', '2025-05-01 19:47:03.215006+00', '2025-05-06 15:18:05.079389+00', false, NULL);
INSERT INTO public.servers (id, name, icon_url, config, created_at, updated_at, active, plan_id) VALUES ('827279558314557480', 'MrBeast', NULL, '{"enabled": false, "channels": [], "language": "en", "system_prompt": "You are a helpful AI assistant for this Discord server.", "max_text_length": 2000, "support_role_id": null, "max_messages_per_user": 10}', '2025-05-05 20:21:10.870622+00', '2025-05-06 15:18:05.090598+00', false, NULL);
INSERT INTO public.servers (id, name, icon_url, config, created_at, updated_at, active, plan_id) VALUES ('1046510699809079448', 'Bot testing server', 'https://cdn.discordapp.com/icons/1046510699809079448/256a79ee01431deb2446463cb476ffce.webp', '{"channels": ["1367528808554692710"], "language": "en", "systemPrompt": "Use your knowledge to help people", "maxTextLength": 2000, "support_role_id": "1367883986680021042", "maxMessagesPerUser": 10}', '2025-05-02 12:14:35.859284+00', '2025-05-13 12:12:00.887272+00', true, NULL);
INSERT INTO public.servers (id, name, icon_url, config, created_at, updated_at, active, plan_id) VALUES ('1054726822337720340', 'Dark and Darker Polska', 'https://cdn.discordapp.com/icons/1054726822337720340/a4bdd0299288fd25580b1da6fe9bdadb.webp', '{"enabled": true, "language": "en", "systemPrompt": "You are a helpful assistant for the Discord server."}', '2025-05-06 14:02:32.314411+00', '2025-05-13 12:12:00.982193+00', true, NULL);
INSERT INTO public.servers (id, name, icon_url, config, created_at, updated_at, active, plan_id) VALUES ('1303095819804610670', 'Losokos''s server', NULL, '{"enabled": true, "channels": [], "language": "en", "system_prompt": "You are a helpful AI assistant for this Discord server.", "welcomeMessage": "Hello! I''m a support bot ready to help you.", "max_text_length": 2000, "support_role_id": null, "max_messages_per_user": 10}', '2025-05-06 15:53:21.816489+00', '2025-05-13 12:12:01.146962+00', true, NULL);


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: conversations_server_1046510699809079448; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('a21806cf-c3de-4dbb-9549-3a1e1b868847', '1046510699809079448', '1367528911902212176', '1367528911902212176', '587059393766359041', 'losokos', '[{"role": "user", "content": "status implementacji"}]', 'completed', '2025-05-08 19:00:17.976766+00', '2025-05-10 15:59:37.618604+00', '2025-05-10 15:59:37.604+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('6fb8397a-df65-4521-a720-6ae614429734', '1046510699809079448', '1367911626409377922', '1367911626409377922', '587059393766359041', 'losokos', '[{"role": "user", "content": "Mam problem, boli mnie brzuch co moge zrobić?"}, {"role": "user", "content": "Mam problem, boli mnie brzuch co moge zrobić?"}, {"role": "assistant", "content": "Przykro mi, że cię boli brzuch. Jeśli ból jest silny, trwa długo, albo towarzyszą mu inne objawy jak gorączka, wymioty, krwawienie czy silne osłabienie, to najlepiej skontaktuj się z lekarzem lub udaj się na pogotowie.\n\nJeśli ból jest łagodny, możesz spróbować:\n- odpocząć i położyć się w wygodnej pozycji,\n- unikać ciężkostrawnych i tłustych potraw,\n- pić dużo wody,\n- zastosować ciepły okład na brzuch.\n\nJeśli chcesz, mogę też za godzinę przypomnieć, że jest obiad. Czy chcesz?"}, {"role": "user", "content": "sprobowalem wszystkiego i nadal boli"}, {"role": "assistant", "content": "Jeśli ból brzucha nadal się utrzymuje mimo odpoczynku i innych domowych sposobów, bardzo ważne jest, aby jak najszybciej skontaktować się z lekarzem lub udać się na pogotowie. Ból brzucha może mieć różne przyczyny, niektóre mogą wymagać pilnej pomocy medycznej.\n\nNie zwlekaj z wizytą u specjalisty, zwłaszcza jeśli ból się nasila lub pojawiają się dodatkowe objawy, takie jak gorączka, wymioty, zawroty głowy czy krwawienie. Twoje zdrowie jest najważniejsze."}, {"role": "user", "content": "mam też srake"}, {"role": "assistant", "content": "Jeśli masz ból brzucha i biegunkę (\"srakę\"), ważne jest, abyś przede wszystkim:\n\n- Pamiętał o nawadnianiu — pij dużo wody, aby uniknąć odwodnienia.\n- Unikał ciężkostrawnych i tłustych potraw, jedz lekkostrawne jedzenie.\n- Odpoczywał i dawał organizmowi czas na regenerację.\n\nJeśli biegunka utrzymuje się dłużej niż 2 dni, jest bardzo nasilona, pojawiają się objawy odwodnienia (suchość w ustach, zawroty głowy, osłabienie), krew w stolcu, gorączka lub silny ból brzucha, koniecznie skontaktuj się z lekarzem jak najszybciej.\n\nJeżeli ból brzucha i biegunka są bardzo silne lub towarzyszą im inne niepokojące objawy, nie zwlekaj z wizytą w placówce medycznej. Zdrowie jest najważniejsze!"}, {"role": "user", "content": "hej"}, {"role": "assistant", "content": "Cześć! Jak mogę Ci pomóc?"}, {"role": "user", "content": "Error: No active conversation found."}, {"role": "assistant", "content": "Wygląda na to, że wystąpił błąd z rozmową. Możesz napisać, jak mogę Ci pomóc?"}, {"role": "user", "content": "Mam problem, boli mnie brzuch co moge zrobić?"}, {"role": "assistant", "content": "Przykro mi, że cię boli brzuch. Obecnie jest 12:45, a za godzinę jest obiad.\n\nJeśli ból brzucha jest łagodny, możesz spróbować:\n- odpocząć i położyć się w wygodnej pozycji,\n- unikać ciężkostrawnych i tłustych potraw,\n- pić dużo wody,\n- zastosować ciepły okład na brzuch.\n\nJeśli ból będzie się utrzymywał lub nasilał, albo pojawią się inne objawy, koniecznie skontaktuj się z lekarzem. Czy chcesz, żebym napisał Ci teraz piosenkę o psie, który jeździł koleją?"}]', 'completed', '2025-05-02 17:14:58.737139+00', '2025-05-06 14:14:12.482313+00', '2025-05-02 17:30:52.041+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('1c180018-8f45-461f-9129-5bff21063ac3', '1046510699809079448', '1367528911902212176', '1367528911902212176', '587059393766359041', 'losokos', '[{"role": "user", "content": "status implementacji"}]', 'completed', '2025-05-08 19:00:18.007595+00', '2025-05-10 15:59:37.618604+00', '2025-05-10 15:59:37.604+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('101114c3-c2f1-4a63-8ac7-e379e18245df', '1046510699809079448', '1370113097246834828', '1370113097246834828', '587059393766359041', 'losokos', '[{"role": "user", "content": "sdsa"}, {"role": "user", "content": "sdsa"}, {"role": "assistant", "content": "Cześć! Widzę, że napisałeś \"sdsa\" — czy mogę jakoś pomóc? Jeśli masz pytanie lub potrzebujesz wsparcia dotyczącego projektu lub czegokolwiek innego, daj znać!"}]', 'completed', '2025-05-08 19:00:19.535818+00', '2025-05-10 15:59:37.618604+00', '2025-05-10 15:59:37.604+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('d7abd67f-ccd5-4803-b7f1-0ceb8199ba78', '1046510699809079448', '1367911626409377922', '1367911626409377922', '587059393766359041', 'losokos', '[{"role": "user", "content": "co wiesz o robieniu shortów i zarabianiu na nich?"}, {"role": "user", "content": "co wiesz o robieniu shortów i zarabianiu na nich?"}, {"role": "assistant", "content": "Robienie shortów, czyli krótkich filmów wideo, stało się bardzo popularne dzięki platformom takim jak TikTok, Instagram Reels czy YouTube Shorts. Zarabianie na shortach jest możliwe na kilka sposobów:\n\n1. **Monetyzacja na platformach**:  \n   - **YouTube Shorts Fund** – YouTube ma specjalny fundusz, z którego wypłaca twórcom nagrody za popularne shorty. Aby kwalifikować się do funduszu, trzeba spełnić określone wymagania, np. mieć określoną liczbę wyświetleń.  \n   - **TikTok Creator Fund** – TikTok także oferuje fundusz dla twórców, którzy tworzą popularne treści, w tym shorty.  \n   - W niektórych krajach Instagram również testuje monetyzację Reels.\n\n2. **Współprace i sponsoring**:  \n   Popularni twórcy shortów mogą nawiązywać współprace z markami, które płacą za promowanie produktów lub usług w krótkich filmikach.\n\n3. **Promowanie własnych produktów lub usług**:  \n   Shorty świetnie nadają się do budowania marki osobistej, kierowania ruchu na stronę, sklep internetowy lub inne kanały sprzedaży.\n\n4. **Affiliate marketing**:  \n   Można umieszczać linki afiliacyjne w opisach lub kierować widzów do produktów, za których sprzedaż otrzymuje się prowizję.\n\n5. **Drive ruch do dłuższych treści**:  \n   Shorty mogą być teaserami lub zapowiedziami dłuższych filmów czy kursów, które są płatne.\n\nWażne jest tworzenie angażujących, krótkich i ciekawych treści, które szybko przyciągną uwagę i będą chętnie oglądane oraz udostępniane. Rozwój konta i zdobywanie widowni jest kluczowe dla zarabiania na shortach.\n\nJeśli chcesz, mogę pomóc Ci z konkretnymi wskazówkami, jak zacząć tworzyć shorty lub jak rozwijać monetyzację na konkretnej platformie."}]', 'completed', '2025-05-08 19:32:38.26328+00', '2025-05-10 15:59:37.618604+00', '2025-05-10 15:59:37.604+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('7dbfa875-24c0-4571-b451-c39f1a0d7a5d', '1046510699809079448', '1370113097246834828', '1370113097246834828', '587059393766359041', 'losokos', '[{"role": "user", "content": "sdsa"}, {"role": "user", "content": "sdsa"}, {"role": "assistant", "content": "Cześć! W czym mogę pomóc? Jeśli masz pytanie lub potrzebujesz wsparcia, daj znać!"}, {"role": "user", "content": "co wiesz o statusie implementacji?"}, {"role": "assistant", "content": "Status implementacji widoku Ustawienia Serwera jest następujący:\n\n### Zrealizowane kroki:\n1. **Utworzenie plików komponentów:** Stworzono pliki `ServerSettingsView.tsx`, `ServerSettingsHeader.tsx`, `ServerSettingsForm.tsx` w katalogu `src/components/`.\n2. **Routing:** Dodano ścieżkę `/servers/:id/settings` w `src/pages/servers/[id]/settings.astro`, która renderuje `ServerSettingsView`. Poprawiono import layoutu na `Layout.astro`.\n3. **ServerSettingsView:** \n   - Pobieranie `id` serwera,\n   - `useEffect` do pobierania danych serwera z API,\n   - Obsługa stanu ładowania i błędów,\n   - Mapowanie danych serwera na model widoku,\n   - Obsługa akcji takich jak zapis, aktywacja, deaktywacja, odświeżenie,\n   - Naprawiono ścieżki importu.\n4. **ServerSettingsHeader:** Stworzono layout z nazwą, ikoną i przyciskami akcji.\n5. **ServerSettingsForm:** \n   - Konfiguracja `react-hook-form` z walidacją Zod,\n   - Layout formularza z komponentami `shadcn/ui` (Button, Input, Textarea, Form, Label, Select, Switch, Sonner),\n   - Placeholder dla MultiSelect kanałów,\n   - Logika `onSubmit`,\n   - Naprawione importy i typowanie.\n6. **Komponenty Shadcn/UI:** Zainstalowano i utworzono brakujące komponenty UI.\n7. **Utility:** Utworzono `src/lib/utils.ts` z funkcją `cn`.\n8. **Powiadomienia:** Dodano `Toaster` do globalnego layoutu i integrację wywołań `toast()`.\n\n### Kolejne kroki:\n1. Implementacja pełnego MultiSelect dla kanałów zamiast placeholdera.\n2. Pobieranie list kanałów i ról z API i przekazywanie ich do formularza.\n3. Ulepszona obsługa błędów API i mapowanie błędów walidacyjnych.\n4. Dopracowanie stylowania widoku.\n5. Pisanie testów jednostkowych i integracyjnych.\n\nJeżeli chcesz, mogę pomóc w którymś z tych kroków lub wyjaśnić coś bardziej szczegółowo."}, {"role": "user", "content": "co wiesz o statusie implementacji?"}, {"role": "assistant", "content": "Status implementacji widoku Ustawienia Serwera jest następujący:\n\n**Zrealizowane kroki:**\n\n1. Utworzono pliki komponentów: `ServerSettingsView.tsx`, `ServerSettingsHeader.tsx`, `ServerSettingsForm.tsx` w katalogu `src/components/`.\n2. Dodano routing dla ścieżki `/servers/:id/settings` w `src/pages/servers/[id]/settings.astro`, która renderuje `ServerSettingsView`. Poprawiono import layoutu na `Layout.astro`.\n3. W `ServerSettingsView` zaimplementowano:\n   - Pobieranie `id` serwera.\n   - `useEffect` do pobierania danych serwera (`GET /api/servers/{id}`).\n   - Obsługę stanu ładowania i błędów.\n   - Mapowanie danych `ServerDetail` na `ServerSettingsViewModel`, wraz z poprawkami typowania.\n   - Funkcje do obsługi akcji (zapis, aktywacja, deaktywacja, odświeżenie) wywołujące odpowiednie API.\n   - Naprawiono ścieżki importu.\n4. Stworzono `ServerSettingsHeader` z nazwą, ikoną i przyciskami akcji.\n5. W `ServerSettingsForm`:\n   - Skonfigurowano `react-hook-form` z modelem widoku.\n   - Dodano walidację Zod.\n   - Zbudowano layout formularza z komponentów shadcn/ui (Button, Input, Textarea, Form, Label, Select, Switch, Sonner).\n   - Dodano placeholder dla `MultiSelect` kanałów.\n   - Obsłużono `onSubmit`.\n   - Naprawiono błędy importu i typowania.\n6. Dodano brakujące komponenty Shadcn/UI i zależności.\n7. Utworzono utilitkę `cn` w `src/lib/utils.ts`.\n8. Dodano powiadomienia (`Toaster`) do globalnego layoutu i integrację z `toast()` w `ServerSettingsView`.\n\n**Kolejne kroki:**\n\n1. Implementacja właściwego komponentu `MultiSelect` dla kanałów zamiast placeholdera.\n2. Pobieranie list kanałów i ról z API, przekazywanie ich do formularza.\n3. Rozbudowa obsługi błędów API i mapowanie ich na pola formularza.\n4. Dopracowanie stylów widoku.\n5. Pisanie testów jednostkowych i integracyjnych.\n\nJeśli chcesz, mogę pomóc w którymś z tych kroków lub odpowiedzieć na konkretne pytania!"}, {"role": "user", "content": "streść mi to"}, {"role": "assistant", "content": "Status implementacji widoku Ustawienia Serwera:\n\n- Utworzono i podłączono komponenty widoku, nagłówka i formularza.\n- Dodano routing i logikę pobierania oraz zapisywania danych serwera z API.\n- Skonfigurowano formularz z walidacją i podstawowym layoutem, używając komponentów UI.\n- Dodano obsługę powiadomień i podstawową obsługę błędów.\n- Wprowadzono niezbędne komponenty i narzędzia pomocnicze.\n\nDo zrobienia pozostało:\n\n- Implementacja pełnego wyboru kanałów (MultiSelect).\n- Pobieranie list kanałów i ról z API.\n- Ulepszenie obsługi błędów i stylowanie.\n- Pisanie testów jednostkowych i integracyjnych."}, {"role": "user", "content": "streść mi to"}, {"role": "assistant", "content": "Status implementacji widoku Ustawienia Serwera:\n\n- Utworzono podstawowe komponenty i routing.\n- Zaimplementowano pobieranie i wyświetlanie danych serwera z API.\n- Stworzono formularz z walidacją i podstawowym layoutem, używając komponentów UI.\n- Dodano obsługę akcji (zapis, aktywacja, deaktywacja, odświeżenie) oraz powiadomienia.\n- Obecnie placeholder dla wyboru kanałów (MultiSelect) wymaga pełnej implementacji.\n- Planowane jest pobieranie list kanałów i ról, poprawa obsługi błędów, dopracowanie stylów i testy.\n\nCzy chcesz, żebym pomógł w którymś z tych obszarów?"}]', 'completed', '2025-05-08 19:00:19.550866+00', '2025-05-08 19:22:07.999178+00', '2025-05-08 19:22:07.988+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('60ec42bf-ba90-4cfc-a11a-e0008b29e1c6', '1046510699809079448', '1370133839992848504', '1370133839992848504', '587059393766359041', 'losokos', '[{"role": "user", "content": "siema"}, {"role": "user", "content": "siema"}, {"role": "assistant", "content": "Siema! Jak mogę pomóc? 😊"}, {"role": "user", "content": "co wiesz o probim?"}, {"role": "assistant", "content": "Probi the stoner to wielki stoner, który lubi ziele i układać kamienie, jak mówisz \"maka paka\". To wszystko, co mam w bazie na jego temat. Chcesz wiedzieć coś więcej?"}, {"role": "user", "content": "boli mnie dupsko, co zrobić?"}, {"role": "assistant", "content": "Przykro mi, że tak się czujesz! Ból w okolicy odbytu może mieć różne przyczyny, od drobnych problemów jak hemoroidy czy podrażnienie, po coś bardziej poważnego. Oto kilka ogólnych wskazówek:\n\n1. **Higiena:** Dbaj o czystość tej okolicy, myj ją delikatnie wodą i unikaj ostrych mydeł.\n2. **Unikaj długiego siedzenia:** Staraj się robić przerwy, rozciągać się i nie siedzieć zbyt długo.\n3. **Dieta:** Jedz dużo błonnika, pij dużo wody, aby zapobiec zaparciom.\n4. **Leki:** Możesz spróbować maści łagodzących lub czopków na hemoroidy, dostępnych w aptece.\n5. **Unikaj drapania:** To może pogorszyć stan.\n\nJeśli ból jest bardzo silny, towarzyszy mu krwawienie, gorączka lub utrzymuje się dłużej niż kilka dni, koniecznie skonsultuj się z lekarzem. W razie poważnych objawów nie zwlekaj z wizytą u specjalisty. \n\nJeśli chcesz, mogę pomóc znaleźć więcej informacji albo podpowiedzieć, gdzie szukać pomocy."}, {"role": "user", "content": "wszystkiego probowalem, nic nie dziala"}, {"role": "assistant", "content": "Skoro już próbowałeś różnych metod i ból nadal się utrzymuje, zdecydowanie warto jak najszybciej skonsultować się z lekarzem, najlepiej proktologiem. Może być konieczne dokładniejsze badanie, aby ustalić przyczynę problemu i wdrożyć odpowiednie leczenie.\n\nJeśli ból jest bardzo silny lub pojawiły się inne objawy, takie jak:\n\n- krwawienie z odbytu,  \n- gorączka,  \n- silny obrzęk lub zaczerwienienie,  \n- trudności z oddawaniem stolca,  \n\nto nie zwlekaj i zgłoś się do szpitala lub na pogotowie.\n\nTwoje zdrowie jest najważniejsze, więc profesjonalna diagnoza i leczenie są kluczowe. Jeśli chcesz, mogę pomóc Ci znaleźć najbliższą przychodnię lub szpital."}]', 'completed', '2025-05-08 20:22:53.590157+00', '2025-05-08 20:24:37.901268+00', '2025-05-08 20:24:37.897+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('b47af2b1-1871-4bf3-a79f-e4386c0afafa', '1046510699809079448', '1367911626409377922', '1367911626409377922', '587059393766359041', 'losokos', '[{"role": "user", "content": "co wiesz o robieniu shortów i zarabianiu na nich?"}, {"role": "user", "content": "co wiesz o robieniu shortów i zarabianiu na nich?"}, {"role": "assistant", "content": "Robienie shortów to tworzenie krótkich filmów wideo, które zwykle mają od kilku sekund do maksymalnie minuty. Platformy takie jak YouTube Shorts, TikTok czy Instagram Reels pozwalają na publikowanie takich treści. Zarabianie na shortach może odbywać się na kilka sposobów:\n\n1. **Monetyzacja platformy**:\n   - Na YouTube Shorts można zarabiać dzięki Funduszowi Shorts (Shorts Fund), gdzie YouTube płaci twórcom za popularne krótkie filmy.\n   - TikTok ma programy takie jak TikTok Creator Fund, które wypłacają twórcom za zaangażowanie i wyświetlenia.\n   - Instagram wprowadza także narzędzia do monetyzacji Reels.\n\n2. **Zwiększenie zasięgu i ruchu**:\n   - Shorty pomagają zdobyć nowych widzów i subskrybentów, co przekłada się na wzrost oglądalności całego kanału.\n   - Większa widownia może zwiększyć zarobki z reklam w dłuższych filmach oraz z innych źródeł.\n\n3. **Marketing i sprzedaż**:\n   - Shorty mogą promować produkty, usługi lub afiliacje.\n   - Twórcy mogą korzystać z shortów do budowania marki osobistej i kierowania ruchu na swoje sklepy, kursy lub inne źródła przychodu.\n\n4. **Sponsorowane treści**:\n   - Popularni twórcy shortów mogą otrzymywać propozycje współpracy od marek, które chcą promować swoje produkty w krótkich formatach.\n\nJeśli chcesz zacząć zarabiać na shortach, ważne jest tworzenie angażujących, atrakcyjnych treści, które szybko przyciągają uwagę widzów, a także regularność publikacji. Znajomość swojej grupy docelowej i trendów na platformach również pomaga osiągnąć sukces."}, {"role": "user", "content": "skąd masz te informacje"}, {"role": "assistant", "content": "Moje informacje pochodzą z aktualnej wiedzy o rynku mediów społecznościowych i strategiach monetyzacji, które są szeroko omawiane w branży marketingu internetowego oraz na oficjalnych stronach platform takich jak YouTube, TikTok i Instagram. \n\nSpecjalizuję się w dostarczaniu rzetelnych i aktualnych danych na podstawie oficjalnych źródeł, analiz trendów, a także powszechnie znanych praktyk stosowanych przez twórców i ekspertów od marketingu cyfrowego. \n\nJeśli chcesz, mogę również wskazać konkretne źródła lub materiały do nauki o zarabianiu na shortach, które są dostępne publicznie."}, {"role": "user", "content": "skąd masz te informacje"}, {"role": "assistant", "content": "Moje informacje pochodzą z szerokiej bazy wiedzy obejmującej aktualne trendy i oficjalne źródła dotyczące platform takich jak YouTube, TikTok czy Instagram oraz ogólne zasady monetyzacji treści online. Są to dane z dokumentacji platform, analiz rynkowych, materiałów edukacyjnych dla twórców oraz obserwacji sposobów zarabiania, które są powszechnie znane i stosowane przez twórców internetowych. \n\nW szczególności informacje o Funduszu Shorts na YouTube, Creator Fund na TikToku czy narzędziach monetyzacji na Instagramie pochodzą z oficjalnych komunikatów tych platform i ich dokumentacji dla twórców. Dodatkowo strategie marketingowe i sposoby zarabiania na shortach są oparte na powszechnie dostępnych praktykach i poradach z branży social media. \n\nJeśli chcesz, mogę pomóc znaleźć konkretne oficjalne źródła lub porady dotyczące tworzenia i monetyzacji shortów."}, {"role": "user", "content": "jakie video zarobiło $10k ( powiedz ze swojej bazy wiedz )"}, {"role": "assistant", "content": "Z mojej bazy wiedzy oraz dostępnych publicznie informacji wynika, że filmy, które mogą zarobić 10 000 dolarów lub więcej na platformach takich jak YouTube, to zazwyczaj:\n\n- **Filmy wiralowe z dużą liczbą wyświetleń** – np. popularne vlogi, wyzwania, tutoriale lub unikalne treści, które przyciągają miliony widzów.\n- **Filmy o tematyce reklamowej lub sponsorowanej** – gdzie twórcy zarabiają nie tylko na reklamach, ale także na współpracach z markami.\n- **Kursy, webinary lub treści edukacyjne** – które są sprzedawane lub promowane za pośrednictwem filmu.\n- **Filmy promujące produkty afiliacyjne** – gdzie dochód pochodzi z prowizji ze sprzedaży.\n\nPrzykładowo, w dużych kanałach gamingowych, lifestyle’owych czy technologicznych, pojedyncze filmy mogą generować dziesiątki tysięcy dolarów przychodu z reklam, zwłaszcza jeśli są to filmy o wysokim CPM (koszt za tysiąc wyświetleń).\n\nNie mam dostępu do konkretnych danych o pojedynczych filmach i ich zarobkach, ale na podstawie trendów i raportów twórców wiadomo, że filmy z milionami wyświetleń i dobrą monetyzacją reklamową mogą łatwo przekroczyć próg 10 000 dolarów przychodu. \n\nJeśli interesuje Cię konkretny przykład lub rodzaj filmów z wysokimi zarobkami, mogę pomóc podać bardziej szczegółowe informacje lub strategie, które sprzyjają takim wynikom."}, {"role": "user", "content": "jakie video zarobiło $10k ( powiedz ze swojej bazy wiedz )"}, {"role": "assistant", "content": "W mojej bazie wiedzy, przykład filmu, który zarobił około 10 000 dolarów, wiąże się z bardzo popularnym i wiralowym contentem na platformach takich jak YouTube Shorts czy TikTok. Najczęściej są to:\n\n- Filmy, które szybko zdobywają miliony wyświetleń dzięki unikalnej, angażującej treści – np. viralowe wyzwania, porady, zabawne momenty lub edukacyjne krótkie filmy.\n- Filmy, które są częścią dobrze rozwiniętego kanału z dużą liczbą subskrybentów i stałym zaangażowaniem widzów.\n- Filmy promujące produkty lub usługi, które generują sprzedaż afiliacyjną lub bezpośrednią.\n\nPrzykładowo, twórca, który w ciągu miesiąca osiągnął 10 000 dolarów na YouTube Shorts, mógł mieć kilka shortów z 10-20 milionami wyświetleń, co w połączeniu z zasięgiem i programem Shorts Fund pozwoliło na taki dochód.\n\nW skrócie – aby zarobić taką kwotę, film musi być bardzo popularny, a twórca powinien wykorzystywać dodatkowo monetyzację poprzez reklamy, sponsoring lub sprzedaż.\n\nJeśli chcesz, mogę podać bardziej szczegółowe przykłady lub strategie, które pomagają osiągać takie wyniki."}, {"role": "user", "content": "Co to jest IPGA i jak to zrobic"}, {"role": "assistant", "content": "IPGA to skrót od **Info Product Growth Agency** — jest to model biznesowy, który łączy agencję marketingową z tworzeniem i skalowaniem produktów informacyjnych online, takich jak kursy, szkolenia czy webinary. \n\nW ramach IPGA agencja pomaga ekspertom i profesjonalistom przekształcić ich wiedzę i doświadczenie w skalowalne biznesy edukacyjne online oraz wspiera ich w promocji, sprzedaży i zarządzaniu tymi produktami. Model ten często zakłada pobieranie opłaty za usługi oraz udziału w zyskach (profit share) z biznesu klienta.\n\n### Jak zacząć IPGA?\n\n1. **Zdobycie wiedzy o tworzeniu i skalowaniu produktów online:**\n   - Naucz się jak tworzyć, uruchamiać i promować kursy online, webinary i inne produkty edukacyjne.\n   - Poznaj narzędzia do tworzenia kursów, platformy e-learningowe oraz strategie marketingowe (np. e-mail marketing, reklamy, social media).\n\n2. **Budowa oferty usług dla ekspertów:**\n   - Oferuj wsparcie w zakresie tworzenia treści, marketingu, sprzedaży i zarządzania produktem.\n   - Możesz też pomagać w technicznej stronie realizacji kursów.\n\n3. **Pozyskiwanie klientów:**\n   - Skup się na profesjonalistach, którzy mają wiedzę i doświadczenie, ale nie wiedzą jak ją skutecznie sprzedawać w formie online.\n   - Wykorzystuj LinkedIn, sieci kontaktów, content marketing, a także rekomendacje.\n\n4. **Model rozliczeń:**\n   - Możesz pobierać opłaty za start (np. 10 000 USD) za przygotowanie i uruchomienie produktu.\n   - Dodatkowo ustalaj procent udziału w zyskach ze sprzedaży produktów (profit share).\n\n5. **Skalowanie agencji:**\n   - Z czasem zatrudniaj zespół, który pomoże w obsłudze klientów i produkcji kursów.\n   - Rozwijaj portfolio klientów i zwiększaj przychody.\n\n### Dlaczego IPGA?\n\n- Duże zapotrzebowanie na usługi profesjonalnego wsparcia w tworzeniu i sprzedaży kursów online.\n- Możliwość osiągania wysokich przychodów z kilku klientów.\n- Model skalowalny i oparty na długofalowej współpracy.\n\nJeśli chcesz, mogę pomóc Ci znaleźć materiały do nauki lub zaproponować konkretne kroki na start IPGA."}, {"role": "user", "content": "Co to jest IPGA i jak to zrobic"}, {"role": "assistant", "content": "IPGA to skrót od **Info Product Growth Agency** — model biznesowy, który łączy agencję marketingową z tworzeniem i skalowaniem produktów edukacyjnych online, takich jak kursy czy szkolenia.\n\n### Czym jest IPGA?\n\n- **Agencja skupiona na rozwoju produktów informacyjnych** — pomaga specjalistom i profesjonalistom zamienić ich wiedzę i doświadczenie w skalowalne biznesy edukacyjne online.\n- **Model biznesowy łączący konsulting, marketing i sprzedaż kursów online**.\n- **Zarabianie na prowizjach i udziale w zyskach** — agencja często pobiera opłatę za usługi oraz procent od zysków generowanych przez kursy.\n\n### Jak zacząć IPGA?\n\n1. **Zdobycie wiedzy o tworzeniu i sprzedaży kursów online**\n   - Naucz się, jak tworzyć wartościowe treści edukacyjne.\n   - Poznaj metody marketingu online, sprzedaży i skalowania produktów cyfrowych.\n\n2. **Budowanie oferty usług**\n   - Oferuj profesjonalistom wsparcie w tworzeniu i uruchamianiu ich kursów.\n   - Pomagaj w strategii marketingowej, tworzeniu materiałów, technicznym wdrożeniu i sprzedaży.\n\n3. **Pozyskiwanie klientów**\n   - Skoncentruj się na profesjonalistach, którzy chcą skalować swój biznes edukacyjny.\n   - Wykorzystuj LinkedIn, sieci kontaktów i inne kanały do nawiązywania relacji biznesowych.\n   - Możesz oferować darmowe konsultacje lub webinary, aby pokazać swoją wartość.\n\n4. **Realizacja projektów i skalowanie**\n   - Pomagaj klientom uruchamiać kampanie, tworzyć kursy i zdobywać uczniów.\n   - Z czasem buduj zespół, który pomoże obsłużyć więcej klientów.\n   - Modeluj biznes tak, by pobierać stałe opłaty i procent z zysków.\n\n### Dlaczego IPGA jest atrakcyjne?\n\n- Rośnie zapotrzebowanie na kursy online i edukację zdalną.\n- Profesjonaliści coraz częściej chcą przekazywać swoją wiedzę w formie produktów cyfrowych.\n- Model pozwala na szybkie skalowanie przy minimalnych kosztach stałych po stronie agencji.\n- Możliwość osiągnięcia wysokich przychodów nawet z pojedynczym klientem.\n\nJeśli chcesz, mogę pomóc Ci stworzyć plan działania krok po kroku, jakie zasoby i umiejętności są potrzebne, oraz jak zacząć pozyskiwać pierwszych klientów dla IPGA."}]', 'completed', '2025-05-08 19:32:38.2668+00', '2025-05-10 15:59:37.618604+00', '2025-05-10 15:59:37.604+00');
INSERT INTO public.conversations_server_1046510699809079448 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('458df868-c49d-471d-b10d-0e9c215437d9', '1046510699809079448', '1371823313776803850', '1371823313776803850', '587059393766359041', 'losokos', '[{"role": "user", "content": "kim jest probi"}, {"role": "user", "content": "kim jest probi"}, {"role": "assistant", "content": "Probi to stoner, który lubi ziele i układać kamienie, jak \"maka paka\". To taka zabawna lub luźna charakterystyka. Czy chcesz wiedzieć coś więcej?"}, {"role": "user", "content": "simeka"}, {"role": "assistant", "content": "Nie mam informacji na temat \"simeka\" w dostępnych danych. Czy możesz podać więcej kontekstu lub wyjaśnić, o co dokładnie chodzi? Chętnie pomogę!"}, {"role": "user", "content": "boli mnie głowa co zrobić?"}, {"role": "assistant", "content": "Przykro mi, że boli Cię głowa. Oto kilka prostych kroków, które mogą pomóc:\n\n1. **Odpocznij w cichym, ciemnym miejscu** — czasem światło i hałas nasilają ból.\n2. **Nawodnij się** — wypij szklankę wody, odwodnienie może powodować ból głowy.\n3. **Zażyj lek przeciwbólowy** — np. paracetamol lub ibuprofen, jeśli nie masz przeciwwskazań.\n4. **Zrelaksuj się i postaraj się rozluźnić mięśnie szyi i ramion** — napięcie mięśniowe często powoduje bóle głowy.\n5. **Unikaj ekranów i intensywnych bodźców** — daj oczom odpocząć.\n\nJeśli ból jest bardzo silny, trwa długo, pojawiają się inne objawy (np. gorączka, sztywność karku, zaburzenia widzenia) lub często się powtarza, koniecznie skonsultuj się z lekarzem. Czy mogę pomóc w czymś jeszcze?"}, {"role": "user", "content": "spróbowałem wszytskiego, nic nie działa"}, {"role": "assistant", "content": "Jeśli próbowałeś już odpoczynku, nawodnienia, leków przeciwbólowych i nadal ból głowy nie ustępuje, a może nawet się nasila, to ważne, abyś jak najszybciej skonsultował się z lekarzem. \n\nUdar, zapalenie opon mózgowych, migrena czy inne poważne schorzenia mogą wymagać pilnej pomocy medycznej. Jeśli ból jest bardzo silny, towarzyszą mu objawy takie jak:\n\n- nudności lub wymioty,\n- zaburzenia widzenia,\n- problemy z mową,\n- osłabienie lub drętwienie jednej strony ciała,\n- sztywność karku,\n- gorączka,\n\nto zgłoś się natychmiast do szpitala lub wezwij pogotowie. \n\nZdrowie jest najważniejsze, nie zwlekaj z wizytą u specjalisty. Czy chcesz, żebym pomógł znaleźć kontakt do najbliższej placówki medycznej?"}]', 'completed', '2025-05-13 12:16:19.554837+00', '2025-05-13 12:17:27.447899+00', '2025-05-13 12:17:27.443+00');


--
-- Data for Name: conversations_server_1054726822337720340; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: conversations_server_1303095819804610670; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.conversations_server_1303095819804610670 (id, server_id, channel_id, thread_id, user_id, username, transcript, status, created_at, updated_at, completed_at) VALUES ('9f54d709-0784-44f1-a3ad-bced25e1a17f', '1303095819804610670', '1303095819804610673', NULL, '587059393766359041', 'losokos', '[{"role": "system", "content": "Relevant knowledge documents: [{\"id\":\"7a5bc123-9d2c-4022-86fc-67121b99440e\",\"title\":\"Welcome to AI Support Bot\",\"score\":1}]"}, {"role": "user", "content": "whats up nigger"}, {"role": "assistant", "content": "I''m sorry, but I can''t engage with that request."}, {"role": "user", "content": "cipa dupa czy cycki? co wolisz suko"}, {"role": "assistant", "content": "Proszę o zachowanie kultury w rozmowie. Jeśli masz pytania lub potrzebujesz pomocy, chętnie pomogę."}, {"role": "user", "content": "co przed chwilą powiedziałem?"}, {"role": "assistant", "content": "Przepraszam, ale nie mam dostępu do wcześniejszych wiadomości w tej rozmowie, więc nie mogę powiedzieć, co przed chwilą powiedziałeś. Jak mogę Ci pomóc?"}]', 'completed', '2025-05-06 16:34:46.128835+00', '2025-05-08 15:24:36.665266+00', '2025-05-08 15:24:36.656+00');


--
-- Data for Name: forwarded_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.forwarded_tickets (id, conversation_id, server_id, assigned_to, forwarded_at, status, resolved_at, resolution_notes, user_id, ai_summary) VALUES ('89e364b0-d566-445b-89ab-c054cc999498', '6fb8397a-df65-4521-a720-6ae614429734', '1046510699809079448', NULL, '2025-05-02 17:30:51.732813+00', 'pending', NULL, 'Requested by user via ''Get Human Assistance'' button', '587059393766359041', '# Podsumowanie zgłoszenia

**Główny problem użytkownika:**  
- Ból brzucha, który nie ustępuje mimo prób domowych metod.  
- Dodatkowo zgłasza biegunkę ("srakę").  

**Podjęte kroki przez użytkownika:**  
- Próby odpoczynku, unikania ciężkostrawnych potraw, picia dużej ilości wody, stosowania ciepłego okładu.  
- Powtarzanie pytania o radę mimo braku poprawy.  

**Sugerowane rozwiązania przez AI:**  
- W przypadku silnego, długo trwającego bólu lub towarzyszących objawów (gorączka, wymioty, krwawienie, osłabienie) zalecenie kontaktu z lekarzem lub pogotowiem.  
- W przypadku łagodnego bólu: odpoczynek, lekkostrawna dieta, nawadnianie, ciepły okład.  
- W przypadku biegunki: nawadnianie, lekkostrawne jedzenie, unikanie ciężkostrawnych potraw, monitorowanie objawów odwodnienia.  
- W przypadku utrzymującego się lub nasilającego bólu i biegunki, konieczność pilnej wizyty u lekarza.  

**Aktualny stan:**  
- Użytkownik zgłasza, że mimo prób domowych metod nadal odczuwa ból brzucha i ma biegunkę.  
- AI podkreśla konieczność natychmiastowego kontaktu z lekarzem, jeśli objawy się nasilają lub utrzymują.  

**Dodatkowe informacje:**  
- Użytkownik wspomina o "srace" (biegunce).  
- W trakcie rozmowy pojawiły się błędy techniczne (np. brak aktywnej rozmowy), ale nie wpływa to na główną treść zgłoszenia.  

**Wnioski:**  
- Użytkownik wymaga pilnej konsultacji medycznej ze względu na utrzymujący się ból brzucha i biegunkę.  
- Zalecane jest przekazanie informacji o konieczności wizyty u lekarza, szczególnie jeśli objawy się pogorszą.');
INSERT INTO public.forwarded_tickets (id, conversation_id, server_id, assigned_to, forwarded_at, status, resolved_at, resolution_notes, user_id, ai_summary) VALUES ('cc25a9ed-a732-4db9-a8a2-149cf37e216e', '7dbfa875-24c0-4571-b451-c39f1a0d7a5d', '1046510699809079448', NULL, '2025-05-08 19:22:07.663006+00', 'pending', NULL, 'Requested by user via ''Get Human Assistance'' button', '587059393766359041', '# Podsumowanie zgłoszenia

## Główny problem/zapytanie
Użytkownik pyta o status implementacji widoku "Ustawienia Serwera" w projekcie.

## Podjęte kroki przez użytkownika
- Wysyłał wiadomości z pytaniem o status.
- Prosił o streszczenie postępów.

## Sugestie od AI
- Opisał szczegółowo wykonane kroki:
  - Utworzenie i podłączenie komponentów (`ServerSettingsView`, `Header`, `Form`).
  - Dodanie routingu i pobierania danych z API.
  - Konfiguracja formularza z walidacją i layoutem.
  - Implementacja obsługi akcji i powiadomień.
  - Utworzenie narzędzi pomocniczych.
- Wskazał dalsze kroki:
  - Pełne wdrożenie MultiSelect dla kanałów.
  - Pobranie list kanałów i ról z API.
  - Ulepszenie obsługi błędów i stylowania.
  - Pisanie testów.

## Aktualny status
- Podstawowa funkcjonalność zaimplementowana:
  - Komponenty i routing.
  - Pobieranie i wyświetlanie danych serwera.
  - Formularz z walidacją i layoutem.
  - Obsługa akcji (zapis, aktywacja, deaktywacja).
  - Powiadomienia.
- Pozostałe zadania do wykonania:
  - Implementacja pełnego wyboru kanałów (MultiSelect).
  - Pobranie list kanałów i ról.
  - Ulepszenie obsługi błędów i stylów.
  - Testy jednostkowe i integracyjne.

## Kontekst techniczny
- Projekt korzysta z React, TypeScript, `react-hook-form`, `Zod`, komponentów UI z `shadcn/ui`.
- API do pobierania danych serwera i list kanałów/ ról.
- Komponenty i funkcje pomocnicze już zaimplementowane lub w trakcie.

**Podsumowując:** prace nad widokiem są na zaawansowanym etapie, głównie brakuje pełnej funkcji wyboru kanałów i obsługi list z API.');
INSERT INTO public.forwarded_tickets (id, conversation_id, server_id, assigned_to, forwarded_at, status, resolved_at, resolution_notes, user_id, ai_summary) VALUES ('b3bdb5f8-623a-489a-bbfb-19fbc68c492e', '60ec42bf-ba90-4cfc-a11a-e0008b29e1c6', '1046510699809079448', NULL, '2025-05-08 20:24:37.530985+00', 'pending', NULL, 'Requested by user via ''Get Human Assistance'' button', '587059393766359041', '# User Issue
- User reports persistent pain in the anal area ("boli mnie dupsko") that has not improved despite trying various remedies.

# Steps Already Attempted
- Personal hygiene adjustments (gentle washing, avoiding harsh soaps)
- Reducing prolonged sitting and incorporating movement
- Dietary changes (high fiber intake, increased water consumption)
- Use of over-the-counter ointments or suppositories for hemorrhoids

# Solutions Suggested by AI
- General advice on hygiene, diet, and avoiding scratching
- Recommendations to see a doctor if pain persists, worsens, or if additional symptoms appear (e.g., bleeding, fever)

# Current Status
- User reports that all attempted remedies have failed to alleviate pain
- Pain persists despite self-care measures

# Technical Context
- Symptoms suggest possible hemorrhoids or other anal issues
- No specific diagnosis provided; AI emphasizes need for professional medical evaluation
- Urgent symptoms (bleeding, fever, swelling) require immediate medical attention

**Summary:** The user is experiencing ongoing anal pain unrelieved by home remedies, indicating the need for professional medical assessment, preferably by a proctologist, to determine underlying cause and appropriate treatment.');
INSERT INTO public.forwarded_tickets (id, conversation_id, server_id, assigned_to, forwarded_at, status, resolved_at, resolution_notes, user_id, ai_summary) VALUES ('b007f4dc-30f5-4828-aa8e-008c08fea8ae', '458df868-c49d-471d-b10d-0e9c215437d9', '1046510699809079448', NULL, '2025-05-13 12:17:27.1862+00', 'pending', NULL, 'Requested by user via ''Get Human Assistance'' button', '587059393766359041', '# Podsumowanie zgłoszenia

## Główny problem użytkownika
- Użytkownik zgłasza ból głowy i pyta, co zrobić.

## Podjęte kroki przez użytkownika
- Nie wymieniono prób samodzielnego leczenia, ale użytkownik stwierdził, że próbował wszystkiego i nic nie działa.

## Sugestie udzielone przez AI
- Zalecenia obejmowały odpoczynek, nawodnienie, zażycie leków przeciwbólowych (np. paracetamol, ibuprofen), relaks mięśni szyi i ramion, unikanie ekranów.
- W przypadku braku poprawy, silnego bólu lub pojawienia się innych objawów, AI zasugerowało konsultację z lekarzem.

## Aktualny stan
- Użytkownik zgłasza, że próbował wszystkiego, ale ból nie ustępuje.
- AI ostrzegło, że jeśli ból się nasila lub pojawią się poważne objawy (np. nudności, wymioty, zaburzenia widzenia, drętwienie, gorączka), konieczna jest natychmiastowa wizyta w szpitalu lub wezwanie pogotowia.

## Kontekst techniczny
- Użytkownik szukał informacji o "probi" i "simeka", co nie jest powiązane z głównym problemem zdrowotnym, ale wskazuje na różnorodność pytań.
- Nie zgłoszono żadnych prób samodzielnego diagnozowania lub stosowania leków bez konsultacji.

**Uwagi:** Użytkownik wymaga pilnej konsultacji medycznej ze względu na brak poprawy i potencjalne poważne objawy.');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, discord_id, discord_username, avatar_url, created_at, updated_at) VALUES ('00000000-0000-0000-0000-000000000000', 'test-user-id', 'Test User#0000', NULL, '2025-05-01 19:40:02.20327+00', '2025-05-01 19:47:58.83464+00');
INSERT INTO public.users (id, discord_id, discord_username, avatar_url, created_at, updated_at) VALUES ('44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '587059393766359041', 'losokos', 'https://cdn.discordapp.com/avatars/587059393766359041/fb89f70f3f01c808014ffb80ee09d9ae.png', '2025-05-08 16:39:40.54014+00', '2025-05-08 16:39:40.54014+00');


--
-- Data for Name: knowledge_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('34045d81-cf45-4e12-b616-a21f2311277b', '1054726822337720340', 'Welcome to AI Support Bot', '# Welcome to AI Support Bot

This is your first knowledge document. You can add more documents to help the bot answer questions about your server.

## How to use knowledge base

1. Create documents with information about your server, rules, FAQs, etc.
2. The bot will use this information to provide more accurate answers to questions.
3. You can organize your knowledge in multiple documents.

## Tips

- Be specific and clear in your documents
- Update documents regularly
- Use markdown formatting for better organization

Feel free to edit or delete this document.', 'md', NULL, NULL, '2025-05-06 14:02:32.426651+00', '2025-05-06 14:02:32.426651+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('7a5bc123-9d2c-4022-86fc-67121b99440e', '1303095819804610670', 'Welcome to AI Support Bot', '# Welcome to AI Support Bot

This is your first knowledge document. You can add more documents to help the bot answer questions about your server.

## How to use knowledge base

1. Create documents with information about your server, rules, FAQs, etc.
2. The bot will use this information to provide more accurate answers to questions.
3. You can organize your knowledge in multiple documents.

## Tips

- Be specific and clear in your documents
- Update documents regularly
- Use markdown formatting for better organization

Feel free to edit or delete this document.', 'md', NULL, NULL, '2025-05-06 16:09:25.203772+00', '2025-05-06 16:09:25.203772+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('96a6d518-be1d-4275-a9bb-4ef8da5483dd', '1046510699809079448', 'new', '', 'md', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 17:10:58.722244+00', '2025-05-08 17:10:58.722244+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('75de2a3e-aeeb-4870-9f17-58f3ae150417', '1046510699809079448', 'new codsadsa', '', 'md', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 17:19:40.120147+00', '2025-05-08 17:19:40.120147+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('1981a55f-76a1-41ce-bc99-88cb7f593008', '1046510699809079448', 'new edited', 'editdsadsadsa', 'txt', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 16:54:33.017607+00', '2025-05-08 17:54:02.902831+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('90ce998d-b708-45d3-ab1f-48dfb3909711', '1046510699809079448', 'markdown', 'dsadsa', 'md', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 18:24:29.028902+00', '2025-05-08 18:24:38.294073+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('1459ca30-22bd-4aca-9118-dd6155141511', '1046510699809079448', 'Mddsadsa', '# Status implementacji widoku Ustawienia Serwera

## Zrealizowane kroki

1.  **Utworzenie plików komponentów:** Stworzono pliki dla `ServerSettingsView.tsx`, `ServerSettingsHeader.tsx`, `ServerSettingsForm.tsx` w katalogu `src/components/`.
2.  **Implementacja routingu:** Dodano ścieżkę `/servers/:id/settings` w `src/pages/servers/[id]/settings.astro`, która renderuje `ServerSettingsView`. Poprawiono import layoutu na `Layout.astro`.
3.  **Implementacja `ServerSettingsView`:**
    - Dodano logikę pobierania `id` serwera.
    - Zaimplementowano `useEffect` do pobierania danych serwera (`GET /api/servers/{id}`).
    - Dodano obsługę stanu ładowania i błędów.
    - Zaimplementowano mapowanie `ServerDetail` na `ServerSettingsViewModel` (w tym poprawki typowania `config`).
    - Dodano funkcje obsługujące akcje (zapis, aktywacja, deaktywacja, odświeżenie) wywołujące odpowiednie endpointy API.
    - Naprawiono ścieżki importu.
4.  **Implementacja `ServerSettingsHeader`:** Stworzono layout z nazwą, ikoną i przyciskami akcji.
5.  **Implementacja `ServerSettingsForm`:**
    - Skonfigurowano `react-hook-form` z `ServerSettingsViewModel`.
    - Zdefiniowano schemat walidacji Zod.
    - Zaimplementowano layout formularza używając komponentów z `shadcn/ui` (w tym dodanie brakujących komponentów i zależności: Button, Input, Textarea, Form, Label, Select, Switch, Sonner).
    - Dodano placeholder dla `MultiSelect` kanałów.
    - Dodano logikę obsługi `onSubmit`.
    - Naprawiono błędy importu i typowania.
6.  **Dodanie komponentów Shadcn/UI:** Zainstalowano i utworzono brakujące komponenty UI: Button, Input, Textarea, Form, Label, Select, Switch, Sonner.
7.  **Utworzenie utility:** Utworzono `src/lib/utils.ts` z funkcją `cn`.
8.  **Implementacja powiadomień:** Dodano `Toaster` do globalnego layoutu (`Layout.astro`) i zintegrowano wywołania `toast()` w `ServerSettingsView`.

## Kolejne kroki

1.  **Implementacja MultiSelect dla kanałów:** Zastąpić placeholder w `ServerSettingsForm` pełną implementacją komponentu `MultiSelect` dla wyboru kanałów.
2.  **Pobieranie list kanałów i ról:** Zaimplementować logikę pobierania list dostępnych kanałów i ról dla danego serwera (np. z API) w `ServerSettingsView` i przekazać je do `ServerSettingsForm`.
3.  **Ulepszona obsługa błędów:** Rozbudować obsługę błędów API, aby lepiej mapować błędy walidacji serwera na pola formularza.
4.  **Stylowanie:** Dopracować wygląd widoku zgodnie z resztą aplikacji.
5.  **Testowanie:** Napisać testy jednostkowe i integracyjne.
', 'md', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 18:58:55.909811+00', '2025-05-08 18:58:55.909811+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('42871401-2ce4-4db1-88cf-87608da377da', '1046510699809079448', 'transcribe', 'now right around this time last year I 
posted a video called the smartest path 
to $10,000 per month in 2023 and that 
video ended up becoming my most 
successful video ever but a lot of 
things have changed since last year and 
so I''m very happy to say that now I can 
redo this video 10 times better and look 
I know that me starting off this video 
by saying that I''m a millionaire might 
come across as a bit flashy or maybe 
even that I''m bragging but at the same 
time my financial status is kind of 
relevant information to you since this 
video is about making money at this 
point I''ve been running multiple online 
businesses for roughly 5 years and 
between those business businesses I''ve 
now pulled in more than $6 million in 
total profit throughout my journey and 
so I think it''s pretty safe to say that 
I have a good idea of how to get to 
$10,000 per month because I got there 
myself more than 4 years ago hopefully 
that builds a bit of Rapport between you 
and I before we get into this video I 
just want to tell you that we''re not 
going to be talking about one business 
model and the five exact steps you need 
to take to make $10,000 per month with 
that one business model instead I''m 
going to illustrate the different paths 
you can take in life to reach that 10K 
per month Mark and then you can evaluate 
based on your life choices and 
preferences and one more important thing 
to celebrate the success of last year''s 
video I''m going to send $1,000 on PayPal 
or the equivalent in Amazon products to 
your doorstep to the person who leaves 
the most inspiring comment below this 
video on top of commenting make sure 
that you''re subscribed and that you''ve 
liked this video now with that said 
let''s get into it I think it''s very 
important by starting off at the most 
foundational level and then we can 
evaluate the strength of our 
opportunities based on that so let''s 
play it safe and say you''re working in a 
supermarket at minimum wage and you''re 
making $15 per hour now if you take that 
$15 and you multiply it by the amount of 
hours you''d have to work per month in a 
full-time position you''d see that you''d 
be making around $2,000 per month so a 
full-time minimum wage position at a 
supermarket like Walmart will make you 
around $2,000 per month now that''s only 
20% of the way to the $10,000 per month 
Mark and Not only would we like to make 
$10,000 per month we''d also like to do 
it with freedom so we could work from 
pretty much anywhere and you definitely 
will not get that Freedom by being stock 
at the floor in Walmart so personally 
this option is not very appealing to me 
but I''m very grateful that there are 
people doing it because with without 
them civilization would not work all 
right so if that''s not for you what can 
you do if you don''t want to take on the 
risk of starting a business but you 
still want to reach that $10,000 per 
month Mark well you can learn how to do 
a higher paid job right you can learn a 
pretty highly paid skill like coding for 
example at a decent level in 6 to 12 
months and the entry level salary for a 
coder in the US is $90,000 per year so 
if you divide that by the 12 months 
we''re already making 
$7,500 per month and so now with this 
entry level coding job we''re actually 
75% of the way to that 10 month Mark but 
we''re still stock working at 925 for a 
boss and we''re not really getting a 
profit share of the business so it''s not 
that much Freedom if you ask me 
furthermore you probably have to show up 
at the office every single day so you 
don''t have location Freedom either but 
once again if you don''t want too much 
responsibility or risk in life this 
could really be a good option for you I 
totally understand if someone would be 
more than happy making $7,500 a month 
going to the office every day and doing 
something like coding it could be a 
really nice lifestyle you can live a 
pretty nice life with that kind of money 
and furthermore if you''re passionate 
about this and you keep improving by 
studying more skills within the field of 
coding you can grow in that position and 
at a certain point I''m sure your salary 
can grow 
to150 200 even 
$250,000 per year now to most people 
that''s a lot of money and so once again 
if you''re like me and you know you have 
that strong entrepreneur in your stomach 
and you want that location freedom and 
the ability to scale your business 
infinitely well then we got to look 
towards entrepreneurship so let''s break 
down what your options are my first 
Venture into online business was at the 
age of 16 where I had grown a in stagram 
account based on men''s fashion to 
roughly 25 to 30,000 followers now 
despite the fact that that''s not a lot 
of followers I was still making $100 per 
day by selling two to three shoutouts 
every single day and so at the peak of 
this I was actually making around $3,000 
per month just from my phone at 16 years 
old by selling shoutouts on a men''s 
fashion Instagram profile so by sending 
messages every day on Instagram and 
selling shoutouts I was making more than 
the minimum wage at Walmart at 16 just 
sending a couple messages from my phone 
but I was not making anywhere near what 
you''d make with an entry level coding 
job at $7,500 granted yes at $16 making 
$33,000 per month just working from your 
phone I cannot complain it was very nice 
but at a certain point I got really 
bored of it because it was not very 
scalable maybe I could have grown it to5 
or even $10,000 per month if I had 
really worked for it but I was not 
really passionate about it and I 
couldn''t see a big future in it it was 
more sort of a good entry that I learned 
something from more than anything it 
opened up my eyes to the fact that 
online business was actually possible 
and that I could create my own path in 
life that was definitely the most 
valuable lesson that I learned from 
doing that business and so I started 
looking for something more scalable and 
that''s when I discovered Shopify Drop 
Shipping now before you say anything I''m 
not doing Drop Shipping and I haven''t 
been doing Drop Shipping for more than 5 
years now but this was the next business 
model that I discovered after selling 
shoutouts it was still a fairly new 
thing at the time it hadn''t gained all 
the hype and traction and saturation 
that it has today and so I decided to 
give it a goal the first disadvantage I 
discovered was you need quite a lot of 
money to actually start this thing 
thankfully I had saved up a couple 
thousand from the Instagram shoutout 
selling and so I was able ble to invest 
that into testing different products 
with paid ads but in all honesty within 
2 months I had burned through most of 
that Capital but eventually I had a 
little breakthrough if you will nothing 
major but it got to a point where I was 
making around $300 to $500 per day with 
my Shopify Drop Shipping Store here''s 
what you have to keep in mind just 
because I was making $3 to $500 per day 
in Revenue it did not mean that I was 
making the same in profit actually quite 
far from it with my store I had roughly 
20 to 30% profit margin if I was making 
$300 every day thatd come out to about 
$99,000 a month which is pretty close to 
that 10K per month Mark but only 30% of 
that was profit so on a good month maybe 
I''d make $3 to $4,000 in profit which 
again is not much more than I was making 
with the shout outs and furthermore this 
was a lot more work the backend 
Logistics were a nightmare customer 
support keeping track of stock 
communicating with suppliers and 
updating the website between everything 
I had more than a full-time job doing 
this and so I just didn''t enjoy the 
process that much now that''s not because 
I don''t like working a lot of hours 
these days I''m working 12 14 hours a day 
but it''s because I''m really passionate 
about what I''m doing today with Drop 
Shipping I couldn''t say the same I had 
absolute zero passion for it why because 
I was selling crappy China products to 
customers all over the world with three 
plus week shipping durations at the end 
of the day even if I was making some 
money with it I was creating zero value 
I wasn''t creating any good impact in the 
world and that really bothered me I 
wanted to wake up every morning look 
myself in the mirror and be proud not 
just of the money I had made but also of 
how I had made it and I could never feel 
that way with Drop Shipping I decided to 
close down that business too but I 
wanted to see how I could take the that 
I had gathered from doing it and turn 
into something valuable that I could 
actually create good impact with and 
that''s when I had the idea of starting 
my social media marketing agency now 
this ended up becoming a really good 
decision and it was something that I ran 
for over 4 years what the SMA business 
model allowed me to do was to take the 
knowledge I''d gathered from e-commerce 
and use it to help valuable companies 
with good products scale their business 
and so just 3 weeks after starting my 
SMA I closed my first $5,400 client and 
within 3 to 6 months I was making $10 to 
$25,000 per month with that agency and 
so at this point I was happy I was 
creating impact for good companies and I 
was making really good money now we 
finally crossed that 10K per month Mark 
which was our goal I said I was making 
10 to 25k per month with my agency 3 to 
6 months after starting and the best 
thing was I had no expenses related to 
this because it was obviously my clients 
that were paying for all the ads so if I 
made $10,000 in Revenue well I made 
pretty much $10,000 in profit as well 
and so after a while of seeing really 
good success with my agency I decided to 
teach other people how to do it as well 
and that''s when I created the business 
that has made me the most money to date 
the SMA Academy a course where I was 
teaching young entrepreneurs how to 
start their own social media marketing 
agencies with that course I ended up 
teaching thousands of students around 
the world and a lot of them ended up 
creating insanely profitable businesses 
with the knowledge in there so many 
people reached 51 $15,000 per month with 
their agencies and the best ones reached 
50 even $100,000 per month and not only 
did I positively impact thousands of 
students with that course I also 
personally made millions of profit by 
doing it now I guess that''s a number a 
lot of online course creators would try 
to hide from you they don''t really want 
you to know how much they''re actually 
making by selling their online courses 
to you but to be honest I see no problem 
in sharing that figure with you because 
there''s nothing wrong with it I impacted 
thousands of students positively so many 
of them created insanely profitable 
businesses and I got rewarded for my 
effort it''s simple math after running my 
Agency for almost 5 years and the course 
for over 3 years the SMA business model 
just wasn''t the same anymore the service 
had become more saturated meaning less 
clients and lower payments and the work 
just wasn''t really creative or fun 
anymore my students were and are still 
making again5 10 15 plus th000 per month 
with their smas but I wanted more for 
them I wanted 15,000 to be average I 
wanted 50,000 to be normal I wanted many 
people to reach $100,000 per month with 
the businesses that I taught them to 
start and most importantly I wanted to 
teach a business model that would 
actually create impact and not just 
money because the way I see it is simple 
the more impact you create the more 
money you''ll make as well and so over 
the last year I''ve gradually closed down 
both the agency and the SMA Academy 
because I needed to step back and take 
some time to create the next master plan 
for people like you and I I think it had 
become crystal clear to pretty much 
everyone that usually the online 
Educators were making more money than 
the students they were teaching and once 
again there''s not necessarily anything 
wrong with that if you''re teaching 
thousands of students how to do a 
business well obviously you''re going to 
make more money than by working with 
five clients in that business but you 
shouldn''t create an online course if 
you''re a beginner and that is true if 
you don''t have valuable expertise or 
skills or an Incredible case study to 
create an online course around well then 
you shouldn''t create an online course at 
all but I was still thinking there must 
be a way that all of the ambitious and 
aspiring onps out there can get a piece 
of the action in this online education 
industry and that''s when it dawned upon 
me mixing the agency model with online 
education at a certain point I started 
to realize that everywhere I looked 
there were professionals asking me to 
help them turn their expertise into 
scalable online education businesses 
they were willing to pay me 5 10 15 
$20,000 per month for this service and 
not only that they were also willing to 
give me high percentages of the profit 
that we make with those businesses 
together and so after a while of 
evaluating I started taking on a couple 
of these clients we call this thing ipga 
pretty simple info product growth agency 
because you''re running an agency that 
helps grow info products with 
professionals as I''ve shown in a couple 
of my past videos these clients all 
started paying me $10,000 just to get 
started and some of those clients are 
now making $2 $300,000 per month with 
their online courses imagine if I''m just 
getting 10% of that every single month 
that''s 10K to start plus $30,000 per 
month with one client so coming back to 
sort of the subject of this video 
reaching 10,000 per month well you could 
technically do that with one of these 
clients it''s so brilliant because once 
again if you''re a beginner without 
valueable expertise skills or a case 
study then you shouldn''t create your own 
online course but what you can do is 
learn everything there is to know about 
online education and The Business of it 
and then you can go out and help 
professionals do it with them while 
getting a permanent profit share of 
every single client that you work with 
the incredible thing is this service is 
so in demand but nobody is supplying it 
clients are literally begging to work 
with me but I cannot fit them all 
obviously so that''s why I''m deciding to 
share this thing now so a couple months 
ago I started teaching this thing to my 
old Academy students and a lot of them 
are signing clients already this guy had 
just started his ipga when he entered a 
sauna in his gym and at the time of 
entering the sauna he had zero clients 
by the time he came out he had just 
signed his first client because he met 
his first client in a sauna my point 
with saying this is ipga clients are 
everywhere there are professionals 
everywhere you look and all of them are 
looking to take their expertise that 
they''ve gained through years of working 
and turn that into a scalable online 
education business because it''s 
incredibly profitable and it''s scaling 
their impact now just recently I 
mentioned this ipga thing for the first 
time publicly and since then it''s 
already starting to take the Internet by 
storm there are so many YouTubers out 
there right now that are starting to 
create videos about this business model 
ipga that I''ve invented and you know 
what there''s nothing wrong with that but 
the truth is they just don''t know how to 
do it it took me more than a year to 
find you this process and that''s not 
even counting the the four or five years 
of experience the growth curve of an 
ipga can be split into four stages the 
first stage is month 1 to three and it''s 
when you start your ipga you sign your 
first client and you grow your profit 
share to 5 to 10K per month so again 
within 3 months you should already be 
making 5 to 10K per month with your ipga 
and so ideally you''ve already reached 
that 10K per month goal by month three 
stage two then happens between month 3 
and 6 and this is when you sign five 
clients and you scale those clients up 
in those 3 months and by the end of the 
sixth month if if you''ve done things 
properly you could be making upwards of 
$225,000 per month already stage three 
is from month 6 to month 12 in this time 
span you sign more clients and you start 
building a team that can help you 
onboard clients and build the courses 
with your clients and skill your clients 
now this is where things start to get a 
little bit more complicated but in stage 
three you can scale your ipga from 25 
all the way up to $100,000 per month 
stage four is where I''m at right now and 
I''m still developing this stage to be 
honest but this is where we go from 
$100,000 per month all the way to a 
million per month but I''m not going to 
publicly reveal feel that yet because as 
said I''m still doing this and developing 
that stage as we''re speaking so with all 
that said how would I start an ipga from 
scratch today well I start by learning 
the base service everything there is to 
know about online education how to 
create launch and scale online courses 
once I had the knowledge I needed I 
started siging clients immediately and 
again the beauty of this thing is that 
the service sells itself there''s so much 
demand but no Supply most people get it 
wrong because they''re always looking for 
more advanced Outreach strategies 
automated email lead generation sending 
100 looms per day when instead they 
could just have a more unique and 
valuable service which is more in demand 
and less in Supply those other lead 
generation and client acquisition 
methods are so boring and they end up 
taking most of your time when instead 
you should actually be focusing on 
improving your service so you can make 
more money in the long run once again 
half the professionals I meet on a daily 
basis want to be my clients and as I 
showed you one of my students just sign 
a client in a sauna they''re everywhere 
and if I never left my house and I 
didn''t know anybody I''d probably just go 
on LinkedIn and offer this service to 
100 professionals and I''m sure I''d get 
at least 10 clients from that the thing 
is you don''t even need 10 clients to get 
rich with ipga you can get rich from one 
client if you have five good clients you 
can make millions with that so forget 
those boring Advanced client acquisition 
strategies and instead learn a service 
which is extremely valuable impactful 
and in demand at the time of recording 
this there''s still almost nobody doing 
this but once again everybody needs it 
now you might be sad thinking right now 
why would these professionals work with 
you if you''ve never actually scaled a 
course yourself well for the exact same 
reason that big companies hire 
Consultants straight out of University 
these young Consultants have not managed 
or scaled the businesses that they''re 
Consulting for but they''ve studied the 
required knowledge so they have the 
models and structures that they need to 
provide Consulting to these businesses 
it''s the exact same thing here if you 
study everything there is to know about 
online education how to create launch 
manage and scale courses well then 
you''re equipped to help these 
professionals and the truth is they 
don''t have much of a choice alternative 
because again there''s pretty much nobody 
offering this so to wrap this thing up 
if I had to go from0 to $10,000 per 
month in 2024 well I think you know what 
my my answer is but that being said if 
you''re happy with 2K a month in a 
full-time job you can go for the 
supermarket job if you want $3,000 per 
month and location Freedom you might try 
the Instagram shout up model however I 
highly doubt that it''s as easy and 
profitable as when I did it 6 years ago 
if you want the safety of employment and 
to make a lot of money you could learn 
something like coding which is a really 
high paid skill and a position that you 
can grow in over time but if you do want 
to go down that entrepreneurial Road and 
you want to get to 10K per month with it 
quickly and then scale to 50 or even 
100,000 per month in 1 to 2 years then I 
definitely go for ipga there''s nothing 
that beats it right now why because 
you''re creating more impact and as a 
result you''re going to make more money 
it''s not like those other selfish online 
business models out there you do got 
work and you get rewarded even more than 
the others it''s really a no-brainer it''s 
a win-win for everybody so I hope that 
this video gave you a little bit of 
perspective once again don''t forget I''m 
going to send $11,000 to the best 
comment Down Below based on what I said 
in this video I''m looking for inspiring 
comments I''m going to send you $1,000 on 
PayPal or the equivalent in Amazon 
products through your doorstep once 
again that was it for this video I 
really hope you took some perspective 
from it and I''ll see you in the next one 
', 'txt', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 19:31:30.826699+00', '2025-05-08 19:31:30.826699+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('c9643353-0e6e-48d5-9e1f-1344d041f972', '1046510699809079448', 'Probi the stonr', 'Probi the stoner to wielki stoner ktory lubi ziele i ukladac kamienie jak maka paka', 'md', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-08 20:22:14.42671+00', '2025-05-08 20:22:14.42671+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('3df29390-992e-4974-b48b-8ef5defccc96', '1046510699809079448', 'Tytuł', 'Plik testowy
', 'md', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-13 12:15:19.764147+00', '2025-05-13 12:15:19.764147+00');
INSERT INTO public.knowledge_documents (id, server_id, title, content, file_type, storage_path, created_by, created_at, updated_at) VALUES ('c38a5f51-5871-4d56-9fe4-ea8724514855', '1046510699809079448', 'transcribe', 'now right around this time last year I 
posted a video called the smartest path 
to $10,000 per month in 2023 and that 
video ended up becoming my most 
successful video ever but a lot of 
things have changed since last year and 
so I''m very happy to say that now I can 
redo this video 10 times better and look 
I know that me starting off this video 
by saying that I''m a millionaire might 
come across as a bit flashy or maybe 
even that I''m bragging but at the same 
time my financial status is kind of 
relevant information to you since this 
video is about making money at this 
point I''ve been running multiple online 
businesses for roughly 5 years and 
between those business businesses I''ve 
now pulled in more than $6 million in 
total profit throughout my journey and 
so I think it''s pretty safe to say that 
I have a good idea of how to get to 
$10,000 per month because I got there 
myself more than 4 years ago hopefully 
that builds a bit of Rapport between you 
and I before we get into this video I 
just want to tell you that we''re not 
going to be talking about one business 
model and the five exact steps you need 
to take to make $10,000 per month with 
that one business model instead I''m 
going to illustrate the different paths 
you can take in life to reach that 10K 
per month Mark and then you can evaluate 
based on your life choices and 
preferences and one more important thing 
to celebrate the success of last year''s 
video I''m going to send $1,000 on PayPal 
or the equivalent in Amazon products to 
your doorstep to the person who leaves 
the most inspiring comment below this 
video on top of commenting make sure 
that you''re subscribed and that you''ve 
liked this video now with that said 
let''s get into it I think it''s very 
important by starting off at the most 
foundational level and then we can 
evaluate the strength of our 
opportunities based on that so let''s 
play it safe and say you''re working in a 
supermarket at minimum wage and you''re 
making $15 per hour now if you take that 
$15 and you multiply it by the amount of 
hours you''d have to work per month in a 
full-time position you''d see that you''d 
be making around $2,000 per month so a 
full-time minimum wage position at a 
supermarket like Walmart will make you 
around $2,000 per month now that''s only 
20% of the way to the $10,000 per month 
Mark and Not only would we like to make 
$10,000 per month we''d also like to do 
it with freedom so we could work from 
pretty much anywhere and you definitely 
will not get that Freedom by being stock 
at the floor in Walmart so personally 
this option is not very appealing to me 
but I''m very grateful that there are 
people doing it because with without 
them civilization would not work all 
right so if that''s not for you what can 
you do if you don''t want to take on the 
risk of starting a business but you 
still want to reach that $10,000 per 
month Mark well you can learn how to do 
a higher paid job right you can learn a 
pretty highly paid skill like coding for 
example at a decent level in 6 to 12 
months and the entry level salary for a 
coder in the US is $90,000 per year so 
if you divide that by the 12 months 
we''re already making 
$7,500 per month and so now with this 
entry level coding job we''re actually 
75% of the way to that 10 month Mark but 
we''re still stock working at 925 for a 
boss and we''re not really getting a 
profit share of the business so it''s not 
that much Freedom if you ask me 
furthermore you probably have to show up 
at the office every single day so you 
don''t have location Freedom either but 
once again if you don''t want too much 
responsibility or risk in life this 
could really be a good option for you I 
totally understand if someone would be 
more than happy making $7,500 a month 
going to the office every day and doing 
something like coding it could be a 
really nice lifestyle you can live a 
pretty nice life with that kind of money 
and furthermore if you''re passionate 
about this and you keep improving by 
studying more skills within the field of 
coding you can grow in that position and 
at a certain point I''m sure your salary 
can grow 
to150 200 even 
$250,000 per year now to most people 
that''s a lot of money and so once again 
if you''re like me and you know you have 
that strong entrepreneur in your stomach 
and you want that location freedom and 
the ability to scale your business 
infinitely well then we got to look 
towards entrepreneurship so let''s break 
down what your options are my first 
Venture into online business was at the 
age of 16 where I had grown a in stagram 
account based on men''s fashion to 
roughly 25 to 30,000 followers now 
despite the fact that that''s not a lot 
of followers I was still making $100 per 
day by selling two to three shoutouts 
every single day and so at the peak of 
this I was actually making around $3,000 
per month just from my phone at 16 years 
old by selling shoutouts on a men''s 
fashion Instagram profile so by sending 
messages every day on Instagram and 
selling shoutouts I was making more than 
the minimum wage at Walmart at 16 just 
sending a couple messages from my phone 
but I was not making anywhere near what 
you''d make with an entry level coding 
job at $7,500 granted yes at $16 making 
$33,000 per month just working from your 
phone I cannot complain it was very nice 
but at a certain point I got really 
bored of it because it was not very 
scalable maybe I could have grown it to5 
or even $10,000 per month if I had 
really worked for it but I was not 
really passionate about it and I 
couldn''t see a big future in it it was 
more sort of a good entry that I learned 
something from more than anything it 
opened up my eyes to the fact that 
online business was actually possible 
and that I could create my own path in 
life that was definitely the most 
valuable lesson that I learned from 
doing that business and so I started 
looking for something more scalable and 
that''s when I discovered Shopify Drop 
Shipping now before you say anything I''m 
not doing Drop Shipping and I haven''t 
been doing Drop Shipping for more than 5 
years now but this was the next business 
model that I discovered after selling 
shoutouts it was still a fairly new 
thing at the time it hadn''t gained all 
the hype and traction and saturation 
that it has today and so I decided to 
give it a goal the first disadvantage I 
discovered was you need quite a lot of 
money to actually start this thing 
thankfully I had saved up a couple 
thousand from the Instagram shoutout 
selling and so I was able ble to invest 
that into testing different products 
with paid ads but in all honesty within 
2 months I had burned through most of 
that Capital but eventually I had a 
little breakthrough if you will nothing 
major but it got to a point where I was 
making around $300 to $500 per day with 
my Shopify Drop Shipping Store here''s 
what you have to keep in mind just 
because I was making $3 to $500 per day 
in Revenue it did not mean that I was 
making the same in profit actually quite 
far from it with my store I had roughly 
20 to 30% profit margin if I was making 
$300 every day thatd come out to about 
$99,000 a month which is pretty close to 
that 10K per month Mark but only 30% of 
that was profit so on a good month maybe 
I''d make $3 to $4,000 in profit which 
again is not much more than I was making 
with the shout outs and furthermore this 
was a lot more work the backend 
Logistics were a nightmare customer 
support keeping track of stock 
communicating with suppliers and 
updating the website between everything 
I had more than a full-time job doing 
this and so I just didn''t enjoy the 
process that much now that''s not because 
I don''t like working a lot of hours 
these days I''m working 12 14 hours a day 
but it''s because I''m really passionate 
about what I''m doing today with Drop 
Shipping I couldn''t say the same I had 
absolute zero passion for it why because 
I was selling crappy China products to 
customers all over the world with three 
plus week shipping durations at the end 
of the day even if I was making some 
money with it I was creating zero value 
I wasn''t creating any good impact in the 
world and that really bothered me I 
wanted to wake up every morning look 
myself in the mirror and be proud not 
just of the money I had made but also of 
how I had made it and I could never feel 
that way with Drop Shipping I decided to 
close down that business too but I 
wanted to see how I could take the that 
I had gathered from doing it and turn 
into something valuable that I could 
actually create good impact with and 
that''s when I had the idea of starting 
my social media marketing agency now 
this ended up becoming a really good 
decision and it was something that I ran 
for over 4 years what the SMA business 
model allowed me to do was to take the 
knowledge I''d gathered from e-commerce 
and use it to help valuable companies 
with good products scale their business 
and so just 3 weeks after starting my 
SMA I closed my first $5,400 client and 
within 3 to 6 months I was making $10 to 
$25,000 per month with that agency and 
so at this point I was happy I was 
creating impact for good companies and I 
was making really good money now we 
finally crossed that 10K per month Mark 
which was our goal I said I was making 
10 to 25k per month with my agency 3 to 
6 months after starting and the best 
thing was I had no expenses related to 
this because it was obviously my clients 
that were paying for all the ads so if I 
made $10,000 in Revenue well I made 
pretty much $10,000 in profit as well 
and so after a while of seeing really 
good success with my agency I decided to 
teach other people how to do it as well 
and that''s when I created the business 
that has made me the most money to date 
the SMA Academy a course where I was 
teaching young entrepreneurs how to 
start their own social media marketing 
agencies with that course I ended up 
teaching thousands of students around 
the world and a lot of them ended up 
creating insanely profitable businesses 
with the knowledge in there so many 
people reached 51 $15,000 per month with 
their agencies and the best ones reached 
50 even $100,000 per month and not only 
did I positively impact thousands of 
students with that course I also 
personally made millions of profit by 
doing it now I guess that''s a number a 
lot of online course creators would try 
to hide from you they don''t really want 
you to know how much they''re actually 
making by selling their online courses 
to you but to be honest I see no problem 
in sharing that figure with you because 
there''s nothing wrong with it I impacted 
thousands of students positively so many 
of them created insanely profitable 
businesses and I got rewarded for my 
effort it''s simple math after running my 
Agency for almost 5 years and the course 
for over 3 years the SMA business model 
just wasn''t the same anymore the service 
had become more saturated meaning less 
clients and lower payments and the work 
just wasn''t really creative or fun 
anymore my students were and are still 
making again5 10 15 plus th000 per month 
with their smas but I wanted more for 
them I wanted 15,000 to be average I 
wanted 50,000 to be normal I wanted many 
people to reach $100,000 per month with 
the businesses that I taught them to 
start and most importantly I wanted to 
teach a business model that would 
actually create impact and not just 
money because the way I see it is simple 
the more impact you create the more 
money you''ll make as well and so over 
the last year I''ve gradually closed down 
both the agency and the SMA Academy 
because I needed to step back and take 
some time to create the next master plan 
for people like you and I I think it had 
become crystal clear to pretty much 
everyone that usually the online 
Educators were making more money than 
the students they were teaching and once 
again there''s not necessarily anything 
wrong with that if you''re teaching 
thousands of students how to do a 
business well obviously you''re going to 
make more money than by working with 
five clients in that business but you 
shouldn''t create an online course if 
you''re a beginner and that is true if 
you don''t have valuable expertise or 
skills or an Incredible case study to 
create an online course around well then 
you shouldn''t create an online course at 
all but I was still thinking there must 
be a way that all of the ambitious and 
aspiring onps out there can get a piece 
of the action in this online education 
industry and that''s when it dawned upon 
me mixing the agency model with online 
education at a certain point I started 
to realize that everywhere I looked 
there were professionals asking me to 
help them turn their expertise into 
scalable online education businesses 
they were willing to pay me 5 10 15 
$20,000 per month for this service and 
not only that they were also willing to 
give me high percentages of the profit 
that we make with those businesses 
together and so after a while of 
evaluating I started taking on a couple 
of these clients we call this thing ipga 
pretty simple info product growth agency 
because you''re running an agency that 
helps grow info products with 
professionals as I''ve shown in a couple 
of my past videos these clients all 
started paying me $10,000 just to get 
started and some of those clients are 
now making $2 $300,000 per month with 
their online courses imagine if I''m just 
getting 10% of that every single month 
that''s 10K to start plus $30,000 per 
month with one client so coming back to 
sort of the subject of this video 
reaching 10,000 per month well you could 
technically do that with one of these 
clients it''s so brilliant because once 
again if you''re a beginner without 
valueable expertise skills or a case 
study then you shouldn''t create your own 
online course but what you can do is 
learn everything there is to know about 
online education and The Business of it 
and then you can go out and help 
professionals do it with them while 
getting a permanent profit share of 
every single client that you work with 
the incredible thing is this service is 
so in demand but nobody is supplying it 
clients are literally begging to work 
with me but I cannot fit them all 
obviously so that''s why I''m deciding to 
share this thing now so a couple months 
ago I started teaching this thing to my 
old Academy students and a lot of them 
are signing clients already this guy had 
just started his ipga when he entered a 
sauna in his gym and at the time of 
entering the sauna he had zero clients 
by the time he came out he had just 
signed his first client because he met 
his first client in a sauna my point 
with saying this is ipga clients are 
everywhere there are professionals 
everywhere you look and all of them are 
looking to take their expertise that 
they''ve gained through years of working 
and turn that into a scalable online 
education business because it''s 
incredibly profitable and it''s scaling 
their impact now just recently I 
mentioned this ipga thing for the first 
time publicly and since then it''s 
already starting to take the Internet by 
storm there are so many YouTubers out 
there right now that are starting to 
create videos about this business model 
ipga that I''ve invented and you know 
what there''s nothing wrong with that but 
the truth is they just don''t know how to 
do it it took me more than a year to 
find you this process and that''s not 
even counting the the four or five years 
of experience the growth curve of an 
ipga can be split into four stages the 
first stage is month 1 to three and it''s 
when you start your ipga you sign your 
first client and you grow your profit 
share to 5 to 10K per month so again 
within 3 months you should already be 
making 5 to 10K per month with your ipga 
and so ideally you''ve already reached 
that 10K per month goal by month three 
stage two then happens between month 3 
and 6 and this is when you sign five 
clients and you scale those clients up 
in those 3 months and by the end of the 
sixth month if if you''ve done things 
properly you could be making upwards of 
$225,000 per month already stage three 
is from month 6 to month 12 in this time 
span you sign more clients and you start 
building a team that can help you 
onboard clients and build the courses 
with your clients and skill your clients 
now this is where things start to get a 
little bit more complicated but in stage 
three you can scale your ipga from 25 
all the way up to $100,000 per month 
stage four is where I''m at right now and 
I''m still developing this stage to be 
honest but this is where we go from 
$100,000 per month all the way to a 
million per month but I''m not going to 
publicly reveal feel that yet because as 
said I''m still doing this and developing 
that stage as we''re speaking so with all 
that said how would I start an ipga from 
scratch today well I start by learning 
the base service everything there is to 
know about online education how to 
create launch and scale online courses 
once I had the knowledge I needed I 
started siging clients immediately and 
again the beauty of this thing is that 
the service sells itself there''s so much 
demand but no Supply most people get it 
wrong because they''re always looking for 
more advanced Outreach strategies 
automated email lead generation sending 
100 looms per day when instead they 
could just have a more unique and 
valuable service which is more in demand 
and less in Supply those other lead 
generation and client acquisition 
methods are so boring and they end up 
taking most of your time when instead 
you should actually be focusing on 
improving your service so you can make 
more money in the long run once again 
half the professionals I meet on a daily 
basis want to be my clients and as I 
showed you one of my students just sign 
a client in a sauna they''re everywhere 
and if I never left my house and I 
didn''t know anybody I''d probably just go 
on LinkedIn and offer this service to 
100 professionals and I''m sure I''d get 
at least 10 clients from that the thing 
is you don''t even need 10 clients to get 
rich with ipga you can get rich from one 
client if you have five good clients you 
can make millions with that so forget 
those boring Advanced client acquisition 
strategies and instead learn a service 
which is extremely valuable impactful 
and in demand at the time of recording 
this there''s still almost nobody doing 
this but once again everybody needs it 
now you might be sad thinking right now 
why would these professionals work with 
you if you''ve never actually scaled a 
course yourself well for the exact same 
reason that big companies hire 
Consultants straight out of University 
these young Consultants have not managed 
or scaled the businesses that they''re 
Consulting for but they''ve studied the 
required knowledge so they have the 
models and structures that they need to 
provide Consulting to these businesses 
it''s the exact same thing here if you 
study everything there is to know about 
online education how to create launch 
manage and scale courses well then 
you''re equipped to help these 
professionals and the truth is they 
don''t have much of a choice alternative 
because again there''s pretty much nobody 
offering this so to wrap this thing up 
if I had to go from0 to $10,000 per 
month in 2024 well I think you know what 
my my answer is but that being said if 
you''re happy with 2K a month in a 
full-time job you can go for the 
supermarket job if you want $3,000 per 
month and location Freedom you might try 
the Instagram shout up model however I 
highly doubt that it''s as easy and 
profitable as when I did it 6 years ago 
if you want the safety of employment and 
to make a lot of money you could learn 
something like coding which is a really 
high paid skill and a position that you 
can grow in over time but if you do want 
to go down that entrepreneurial Road and 
you want to get to 10K per month with it 
quickly and then scale to 50 or even 
100,000 per month in 1 to 2 years then I 
definitely go for ipga there''s nothing 
that beats it right now why because 
you''re creating more impact and as a 
result you''re going to make more money 
it''s not like those other selfish online 
business models out there you do got 
work and you get rewarded even more than 
the others it''s really a no-brainer it''s 
a win-win for everybody so I hope that 
this video gave you a little bit of 
perspective once again don''t forget I''m 
going to send $11,000 to the best 
comment Down Below based on what I said 
in this video I''m looking for inspiring 
comments I''m going to send you $1,000 on 
PayPal or the equivalent in Amazon 
products through your doorstep once 
again that was it for this video I 
really hope you took some perspective 
from it and I''ll see you in the next one 
', 'txt', NULL, '44d6abb0-edc1-47c2-a736-4bc5b5b4345e', '2025-05-13 12:22:21.957034+00', '2025-05-13 12:22:21.957034+00');


--
-- Data for Name: server_admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.server_admins (server_id, user_id, created_at) VALUES ('1116582282380189789', '00000000-0000-0000-0000-000000000000', '2025-05-01 19:47:03.215006+00');
INSERT INTO public.server_admins (server_id, user_id, created_at) VALUES ('1046510699809079448', '00000000-0000-0000-0000-000000000000', '2025-05-02 12:14:35.859284+00');
INSERT INTO public.server_admins (server_id, user_id, created_at) VALUES ('827279558314557480', '00000000-0000-0000-0000-000000000000', '2025-05-05 20:21:10.870622+00');
INSERT INTO public.server_admins (server_id, user_id, created_at) VALUES ('1054726822337720340', '00000000-0000-0000-0000-000000000000', '2025-05-06 14:02:32.314411+00');
INSERT INTO public.server_admins (server_id, user_id, created_at) VALUES ('1303095819804610670', '00000000-0000-0000-0000-000000000000', '2025-05-06 15:53:21.816489+00');


--
-- Data for Name: shards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: server_shards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116024918, '2025-05-01 19:39:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116045059, '2025-05-01 19:39:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116050929, '2025-05-01 19:39:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116051442, '2025-05-01 19:39:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116212300, '2025-05-01 19:39:57');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213355, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116213934, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211116214523, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211122062447, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211124070109, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204204, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211202204605, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211210212804, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20211228014915, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220107221237, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220228202821, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220312004840, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603231003, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220603232444, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220615214548, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220712093339, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220908172859, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20220916233421, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230119133233, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025114, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230128025212, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230227211149, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230228184745, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230308225145, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20230328144023, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231018144023, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144023, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144024, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20231204144025, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240108234812, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240109165339, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240227174441, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240311171622, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240321100241, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240401105812, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240418121054, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240523004032, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240618124746, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240801235015, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240805133720, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240827160934, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163303, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20240919163305, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241019105805, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241030150047, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241108114728, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241121104152, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241130184212, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220035512, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241220123912, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20241224161212, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250107150512, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250110162412, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250123174212, '2025-05-01 19:39:58');
INSERT INTO realtime.schema_migrations (version, inserted_at) VALUES (20250128220012, '2025-05-01 19:39:58');


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (0, 'create-migrations-table', 'e18db593bcde2aca2a408c4d1100f6abba2195df', '2025-05-01 19:40:00.251992');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (1, 'initialmigration', '6ab16121fbaa08bbd11b712d05f358f9b555d777', '2025-05-01 19:40:00.256094');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (2, 'storage-schema', '5c7968fd083fcea04050c1b7f6253c9771b99011', '2025-05-01 19:40:00.257635');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (3, 'pathtoken-column', '2cb1b0004b817b29d5b0a971af16bafeede4b70d', '2025-05-01 19:40:00.269074');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (4, 'add-migrations-rls', '427c5b63fe1c5937495d9c635c263ee7a5905058', '2025-05-01 19:40:00.288063');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (5, 'add-size-functions', '79e081a1455b63666c1294a440f8ad4b1e6a7f84', '2025-05-01 19:40:00.291416');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (6, 'change-column-name-in-get-size', 'f93f62afdf6613ee5e7e815b30d02dc990201044', '2025-05-01 19:40:00.295883');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (7, 'add-rls-to-buckets', 'e7e7f86adbc51049f341dfe8d30256c1abca17aa', '2025-05-01 19:40:00.299509');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (8, 'add-public-to-buckets', 'fd670db39ed65f9d08b01db09d6202503ca2bab3', '2025-05-01 19:40:00.302167');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (9, 'fix-search-function', '3a0af29f42e35a4d101c259ed955b67e1bee6825', '2025-05-01 19:40:00.305507');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (10, 'search-files-search-function', '68dc14822daad0ffac3746a502234f486182ef6e', '2025-05-01 19:40:00.308996');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (11, 'add-trigger-to-auto-update-updated_at-column', '7425bdb14366d1739fa8a18c83100636d74dcaa2', '2025-05-01 19:40:00.31796');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (12, 'add-automatic-avif-detection-flag', '8e92e1266eb29518b6a4c5313ab8f29dd0d08df9', '2025-05-01 19:40:00.324169');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (13, 'add-bucket-custom-limits', 'cce962054138135cd9a8c4bcd531598684b25e7d', '2025-05-01 19:40:00.327321');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (14, 'use-bytes-for-max-size', '941c41b346f9802b411f06f30e972ad4744dad27', '2025-05-01 19:40:00.330787');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (15, 'add-can-insert-object-function', '934146bc38ead475f4ef4b555c524ee5d66799e5', '2025-05-01 19:40:00.34901');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (16, 'add-version', '76debf38d3fd07dcfc747ca49096457d95b1221b', '2025-05-01 19:40:00.351986');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (17, 'drop-owner-foreign-key', 'f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101', '2025-05-01 19:40:00.354445');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (18, 'add_owner_id_column_deprecate_owner', 'e7a511b379110b08e2f214be852c35414749fe66', '2025-05-01 19:40:00.356701');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (19, 'alter-default-value-objects-id', '02e5e22a78626187e00d173dc45f58fa66a4f043', '2025-05-01 19:40:00.359795');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (20, 'list-objects-with-delimiter', 'cd694ae708e51ba82bf012bba00caf4f3b6393b7', '2025-05-01 19:40:00.361852');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (21, 's3-multipart-uploads', '8c804d4a566c40cd1e4cc5b3725a664a9303657f', '2025-05-01 19:40:00.368027');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (22, 's3-multipart-uploads-big-ints', '9737dc258d2397953c9953d9b86920b8be0cdb73', '2025-05-01 19:40:00.392806');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (23, 'optimize-search-function', '9d7e604cddc4b56a5422dc68c9313f4a1b6f132c', '2025-05-01 19:40:00.409374');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (24, 'operation-function', '8312e37c2bf9e76bbe841aa5fda889206d2bf8aa', '2025-05-01 19:40:00.412121');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (25, 'custom-metadata', 'd974c6057c3db1c1f847afa0e291e6165693b990', '2025-05-01 19:40:00.416309');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (26, 'objects-prefixes', 'ef3f7871121cdc47a65308e6702519e853422ae2', '2025-05-01 19:40:00.419138');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (27, 'search-v2', '33b8f2a7ae53105f028e13e9fcda9dc4f356b4a2', '2025-05-01 19:40:00.43211');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (28, 'object-bucket-name-sorting', '8f385d71c72f7b9f6388e22f6e393e3b78bf8617', '2025-05-01 19:40:00.441508');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (29, 'create-prefixes', '8416491709bbd2b9f849405d5a9584b4f78509fb', '2025-05-01 19:40:00.44659');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (30, 'update-object-levels', 'f5899485e3c9d05891d177787d10c8cb47bae08a', '2025-05-01 19:40:00.449411');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (31, 'objects-level-index', '33f1fef7ec7fea08bb892222f4f0f5d79bab5eb8', '2025-05-01 19:40:00.456625');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (32, 'backward-compatible-index-on-objects', '2d51eeb437a96868b36fcdfb1ddefdf13bef1647', '2025-05-01 19:40:00.462344');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (33, 'backward-compatible-index-on-prefixes', 'fe473390e1b8c407434c0e470655945b110507bf', '2025-05-01 19:40:00.468158');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (34, 'optimize-search-function-v1', '82b0e469a00e8ebce495e29bfa70a0797f7ebd2c', '2025-05-01 19:40:00.469509');
INSERT INTO storage.migrations (id, name, hash, executed_at) VALUES (35, 'add-insert-trigger-prefixes', '63bb9fd05deb3dc5e9fa66c83e82b152f0caf589', '2025-05-01 19:40:00.473603');


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--

INSERT INTO supabase_functions.migrations (version, inserted_at) VALUES ('initial', '2025-05-01 19:39:46.060555+00');
INSERT INTO supabase_functions.migrations (version, inserted_at) VALUES ('20210809183423_update_grants', '2025-05-01 19:39:46.060555+00');


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

INSERT INTO supabase_migrations.schema_migrations (version, statements, name) VALUES ('20250416120900', '{"-- Migration: initial_schema
-- Description: Creates the initial database schema for the Discord AI Support Bot
-- Created at: 2025-04-16 12:09:00 UTC

-- Functions
-- Function for automatically updating the updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql","-- Function to notify the bot about server config changes
create or replace function public.notify_server_config_changed()
returns trigger as $$
begin
  perform pg_notify(''server_config_changed'', json_build_object(
    ''server_id'', new.id,
    ''config'', new.config
  )::text);
  return new;
end;
$$ language plpgsql","-- Tables

-- Users table - connects Discord users to auth system
create table public.users (
    id uuid primary key references auth.users(id),
    discord_id text not null unique,
    discord_username text not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
)","-- Enable RLS on users table
alter table public.users enable row level security","-- RLS policies for users table
create policy users_select_own_policy on public.users
  for select
  using (id = auth.uid())","create policy users_update_own_policy on public.users
  for update
  using (id = auth.uid())","-- Track changes to updated_at
create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at()","-- Billing plans table
create table public.billing_plans (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    price decimal(10, 2) not null,
    currency text not null default ''USD'',
    interval text not null check (interval in (''monthly'', ''yearly'')),
    features jsonb not null default ''{}'',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
)","-- Enable RLS on billing_plans table
alter table public.billing_plans enable row level security","-- RLS policies for billing_plans table
create policy billing_plans_select_public on public.billing_plans
  for select
  using (true)","-- Track changes to updated_at
create trigger set_billing_plans_updated_at
before update on public.billing_plans
for each row
execute function public.set_updated_at()","-- Servers table - stores Discord server information and configuration
create table public.servers (
    id text primary key, -- Discord server ID (as text to handle snowflake IDs)
    name text not null,
    icon_url text,
    config jsonb not null default ''{
        \"enabled\": false,
        \"language\": \"en\",
        \"system_prompt\": \"You are a helpful AI assistant for this Discord server.\",
        \"channels\": [],
        \"support_role_id\": null,
        \"max_messages_per_user\": 10,
        \"max_text_length\": 2000
    }'',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    active boolean not null default true,
    plan_id uuid references public.billing_plans(id)
)","-- Enable RLS on servers table
alter table public.servers enable row level security","-- Track changes to updated_at
create trigger set_servers_updated_at
before update on public.servers
for each row
execute function public.set_updated_at()","-- Notify bot of config changes
create trigger notify_server_config_changed
after update of config on public.servers
for each row
when (old.config is distinct from new.config)
execute function public.notify_server_config_changed()","-- Server admins table - links users to servers they can manage
create table public.server_admins (
    server_id text references public.servers(id) on delete cascade,
    user_id uuid references public.users(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (server_id, user_id)
)","-- Enable RLS on server_admins table
alter table public.server_admins enable row level security","-- RLS policies for server_admins table
create policy server_admins_select_own on public.server_admins
  for select
  using (user_id = auth.uid())","-- RLS policies for servers table
-- Allow users to see only servers they are admins for
create policy server_select_policy on public.servers
    for select
    using (id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Allow admins to update only servers they are admins for
create policy server_update_policy on public.servers
    for update
    using (id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Knowledge documents table - stores knowledge base documents for servers
create table public.knowledge_documents (
    id uuid primary key default gen_random_uuid(),
    server_id text not null references public.servers(id) on delete cascade,
    title text not null,
    content text not null,
    content_vector tsvector generated always as (to_tsvector(''english'', content)) stored,
    file_type text not null check (file_type in (''txt'', ''md'', ''pdf'')),
    storage_path text,
    created_by uuid references public.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
)","-- Enable RLS on knowledge_documents table
alter table public.knowledge_documents enable row level security","-- Track changes to updated_at
create trigger set_knowledge_documents_updated_at
before update on public.knowledge_documents
for each row
execute function public.set_updated_at()","-- Create index for full-text search
create index knowledge_documents_content_vector_idx on public.knowledge_documents using gin (content_vector)","create index knowledge_documents_server_id_idx on public.knowledge_documents (server_id)","-- RLS policies for knowledge_documents table
-- Allow users to see only knowledge documents for servers they are admins for
create policy knowledge_document_select_policy on public.knowledge_documents
    for select
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Allow admins to insert knowledge documents only for servers they are admins for
create policy knowledge_document_insert_policy on public.knowledge_documents
    for insert
    with check (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Allow admins to update knowledge documents only for servers they are admins for
create policy knowledge_document_update_policy on public.knowledge_documents
    for update
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Allow admins to delete knowledge documents only for servers they are admins for
create policy knowledge_document_delete_policy on public.knowledge_documents
    for delete
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Conversations table - stores chat history with the bot
create table public.conversations (
    id uuid not null default gen_random_uuid(),
    server_id text not null references public.servers(id) on delete cascade,
    channel_id text not null,
    thread_id text,
    user_id text not null, -- Discord user ID
    username text not null,
    transcript jsonb not null, -- Stores complete conversation history
    status text not null check (status in (''active'', ''completed'', ''forwarded'')) default ''active'',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    completed_at timestamptz,
    primary key (id, server_id)
) partition by list (server_id)","-- Enable RLS on conversations table
alter table public.conversations enable row level security","-- Track changes to updated_at
create trigger set_conversations_updated_at
before update on public.conversations
for each row
execute function public.set_updated_at()","-- Create indexes
create index conversations_server_id_idx on public.conversations (server_id)","create index conversations_status_idx on public.conversations (status)","create index conversations_created_at_idx on public.conversations (created_at)","-- RLS policies for conversations table
-- Allow users to see only conversations for servers they are admins for
create policy conversation_select_policy on public.conversations
    for select
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Forwarded tickets table - tracks support tickets forwarded to human agents
create table public.forwarded_tickets (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null,
    server_id text not null references public.servers(id) on delete cascade,
    assigned_to text, -- Discord user ID of support member
    forwarded_at timestamptz not null default now(),
    status text not null check (status in (''pending'', ''assigned'', ''resolved'')) default ''pending'',
    resolved_at timestamptz,
    resolution_notes text,
    -- Add foreign key constraint referencing both columns of conversations primary key
    foreign key (conversation_id, server_id) references public.conversations(id, server_id) on delete cascade
)","-- Enable RLS on forwarded_tickets table
alter table public.forwarded_tickets enable row level security","-- Create indexes
create index forwarded_tickets_conversation_id_idx on public.forwarded_tickets (conversation_id)","create index forwarded_tickets_server_id_idx on public.forwarded_tickets (server_id)","create index forwarded_tickets_status_idx on public.forwarded_tickets (status)","-- RLS policies for forwarded_tickets table
-- Allow users to see only forwarded tickets for servers they are admins for
create policy forwarded_ticket_select_policy on public.forwarded_tickets
    for select
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Allow admins to update forwarded tickets only for servers they are admins for
create policy forwarded_ticket_update_policy on public.forwarded_tickets
    for update
    using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Shards table - manages bot sharding for scalability
create table public.shards (
    id integer primary key,
    status text not null check (status in (''online'', ''offline'', ''starting'', ''stopping'')) default ''offline'',
    server_count integer not null default 0,
    last_heartbeat timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
)","-- Enable RLS on shards table
alter table public.shards enable row level security","-- Track changes to updated_at
create trigger set_shards_updated_at
before update on public.shards
for each row
execute function public.set_updated_at()","-- RLS policies for shards table (admin only)
create policy shards_select_admin on public.shards
  for select
  using (auth.uid() in (select id from public.users))","-- Server shards table - maps servers to shards
create table public.server_shards (
    server_id text primary key references public.servers(id) on delete cascade,
    shard_id integer not null references public.shards(id) on delete cascade,
    assigned_at timestamptz not null default now()
)","-- Enable RLS on server_shards table
alter table public.server_shards enable row level security","-- Create index
create index server_shards_shard_id_idx on public.server_shards (shard_id)","-- RLS policies for server_shards table
create policy server_shards_select_admin on public.server_shards
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Subscriptions table - tracks server subscriptions to billing plans
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    server_id text not null references public.servers(id) on delete cascade,
    plan_id uuid not null references public.billing_plans(id),
    status text not null check (status in (''active'', ''canceled'', ''past_due'', ''trialing'')),
    current_period_start timestamptz not null,
    current_period_end timestamptz not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    canceled_at timestamptz,
    unique (server_id)
)","-- Enable RLS on subscriptions table
alter table public.subscriptions enable row level security","-- Track changes to updated_at
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at()","-- Create index
create index subscriptions_status_idx on public.subscriptions (status)","-- RLS policies for subscriptions table
create policy subscriptions_select_admin on public.subscriptions
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Invoices table - tracks billing invoices for server subscriptions
create table public.invoices (
    id uuid primary key default gen_random_uuid(),
    subscription_id uuid not null references public.subscriptions(id) on delete cascade,
    server_id text not null references public.servers(id) on delete cascade,
    amount decimal(10, 2) not null,
    currency text not null default ''USD'',
    status text not null check (status in (''draft'', ''open'', ''paid'', ''uncollectible'', ''void'')),
    invoice_date timestamptz not null,
    due_date timestamptz not null,
    paid_at timestamptz,
    payment_processor_id text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
)","-- Enable RLS on invoices table
alter table public.invoices enable row level security","-- Track changes to updated_at
create trigger set_invoices_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at()","-- Create indexes
create index invoices_subscription_id_idx on public.invoices (subscription_id)","create index invoices_server_id_idx on public.invoices (server_id)","create index invoices_status_idx on public.invoices (status)","-- RLS policies for invoices table
create policy invoices_select_admin on public.invoices
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Analytics table - stores daily usage statistics for servers
create table public.analytics (
    id uuid primary key default gen_random_uuid(),
    server_id text not null references public.servers(id) on delete cascade,
    date date not null,
    total_queries integer not null default 0,
    resolved_queries integer not null default 0,
    forwarded_tickets integer not null default 0,
    average_response_time decimal(10, 2),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (server_id, date)
)","-- Enable RLS on analytics table
alter table public.analytics enable row level security","-- Track changes to updated_at
create trigger set_analytics_updated_at
before update on public.analytics
for each row
execute function public.set_updated_at()","-- Create indexes
create index analytics_server_id_idx on public.analytics (server_id)","create index analytics_date_idx on public.analytics (date)","-- RLS policies for analytics table
create policy analytics_select_admin on public.analytics
  for select
  using (server_id in (select server_id from public.server_admins where user_id = auth.uid()))","-- Example of partition creation for conversations table
-- This is commented out as it would typically be created on-demand when a new server is added
/*
create table public.conversations_server_12345678 partition of public.conversations
    for values in (12345678);
*/

-- Comment explaining partition strategy
comment on table public.conversations is ''The conversations table is partitioned by server_id to improve query performance. New partitions should be created for each server when needed.''","-- Add helpful comments about Discord snowflake IDs
comment on column public.servers.id is ''Discord server ID stored as text to handle Discord snowflake IDs which exceed JavaScript safe integer limits''","comment on column public.analytics.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.conversations.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.forwarded_tickets.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.invoices.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.knowledge_documents.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.server_admins.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.server_shards.server_id is ''Discord server ID (text) - references servers.id''","comment on column public.subscriptions.server_id is ''Discord server ID (text) - references servers.id''"}', 'initial_schema');
INSERT INTO supabase_migrations.schema_migrations (version, statements, name) VALUES ('20250417120900', '{"-- Migration: add_mock_user
-- Description: Creates a mock user for testing and adds necessary RLS policies
-- Created at: 2025-04-17 12:09:00 UTC

-- ========================================================================================
-- Metadata:
-- Purpose: Create a mock user for development and testing purposes
--          This allows our bot to authenticate as a test user
--          Also implements RLS policies that accept a special header for authentication
-- ========================================================================================

-- Start transaction
BEGIN","-- Create a mock user in the auth.users table if it doesn''t exist yet
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
VALUES 
  (''00000000-0000-0000-0000-000000000000'', ''test@example.com'', 
   ''$2a$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'', -- Dummy hashed password, not actually used 
   CURRENT_TIMESTAMP, 
   ''{\"provider\": \"email\", \"providers\": [\"email\"]}'',
   ''{\"name\": \"Test User\"}'')
ON CONFLICT (id) DO NOTHING","-- Create a corresponding entry in public.users
INSERT INTO public.users (id, discord_id, discord_username, avatar_url)
VALUES 
  (''00000000-0000-0000-0000-000000000000'', ''test-user-id'', ''Test User#0000'', NULL)
ON CONFLICT (id) DO NOTHING","-- ========================================================================================
-- Enable RLS and add policies for the mock user
-- ========================================================================================

-- Policy for inserting servers - using mock user ID from header
CREATE POLICY \"mock_test_user_insert_servers\"
ON public.servers
FOR INSERT
TO authenticated
WITH CHECK (
  current_setting(''request.headers'')::json->>''x-mock-user-id'' = ''test-user-id''
)","-- Policy for selecting servers - using mock user ID from header
CREATE POLICY \"mock_test_user_select_servers\"
ON public.servers
FOR SELECT
TO authenticated
USING (
  current_setting(''request.headers'')::json->>''x-mock-user-id'' = ''test-user-id''
)","-- Policy for updating servers - using mock user ID from header
CREATE POLICY \"mock_test_user_update_servers\"
ON public.servers
FOR UPDATE
TO authenticated
USING (
  current_setting(''request.headers'')::json->>''x-mock-user-id'' = ''test-user-id''
)","-- Policy for deleting servers - using mock user ID from header
CREATE POLICY \"mock_test_user_delete_servers\"
ON public.servers
FOR DELETE
TO authenticated
USING (
  current_setting(''request.headers'')::json->>''x-mock-user-id'' = ''test-user-id''
)","-- ========================================================================================
-- Add a special service role policy that allows the API to insert/update
-- servers when authenticated as service_role
-- ========================================================================================

-- Policy for service role to manage servers
CREATE POLICY \"service_role_manage_servers\"
ON public.servers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true)","-- Also add the mock user as an admin for all servers
CREATE OR REPLACE FUNCTION add_mock_user_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.server_admins (server_id, user_id)
  VALUES (NEW.id, ''00000000-0000-0000-0000-000000000000'')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql","-- Trigger to automatically add mock user as admin when a new server is created
CREATE TRIGGER add_mock_user_admin_trigger
AFTER INSERT ON public.servers
FOR EACH ROW
EXECUTE FUNCTION add_mock_user_as_admin()","-- Commit all changes
COMMIT"}', 'add_mock_user');


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

INSERT INTO supabase_migrations.seed_files (path, hash) VALUES ('supabase/seed.sql', '29861473e75433b988a544d423774c3ec47dd6db294eb5b00e1f2d615eeeb0a3');


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 31, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('supabase_functions.hooks_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

