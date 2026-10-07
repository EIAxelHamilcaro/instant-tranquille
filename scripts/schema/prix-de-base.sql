BEGIN;

CREATE TYPE public.enum__pricing_config_v_version_nightly_rates_guests AS ENUM (
    '2',
    '4',
    '6'
);

CREATE TYPE public.enum_pricing_config_nightly_rates_guests AS ENUM (
    '2',
    '4',
    '6'
);

CREATE TABLE public._pricing_config_v_version_nightly_rates (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    guests public.enum__pricing_config_v_version_nightly_rates_guests,
    price numeric,
    _uuid character varying
);

CREATE SEQUENCE public._pricing_config_v_version_nightly_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public._pricing_config_v_version_nightly_rates_id_seq OWNED BY public._pricing_config_v_version_nightly_rates.id;

CREATE TABLE public.pricing_config_nightly_rates (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    guests public.enum_pricing_config_nightly_rates_guests,
    price numeric
);

ALTER TABLE ONLY public._pricing_config_v_version_nightly_rates ALTER COLUMN id SET DEFAULT nextval('public._pricing_config_v_version_nightly_rates_id_seq'::regclass);

ALTER TABLE ONLY public._pricing_config_v_version_nightly_rates
    ADD CONSTRAINT _pricing_config_v_version_nightly_rates_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.pricing_config_nightly_rates
    ADD CONSTRAINT pricing_config_nightly_rates_pkey PRIMARY KEY (id);

CREATE INDEX _pricing_config_v_version_nightly_rates_order_idx ON public._pricing_config_v_version_nightly_rates USING btree (_order);

CREATE INDEX _pricing_config_v_version_nightly_rates_parent_id_idx ON public._pricing_config_v_version_nightly_rates USING btree (_parent_id);

CREATE INDEX pricing_config_nightly_rates_order_idx ON public.pricing_config_nightly_rates USING btree (_order);

CREATE INDEX pricing_config_nightly_rates_parent_id_idx ON public.pricing_config_nightly_rates USING btree (_parent_id);

ALTER TABLE ONLY public._pricing_config_v_version_nightly_rates
    ADD CONSTRAINT _pricing_config_v_version_nightly_rates_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._pricing_config_v(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.pricing_config_nightly_rates
    ADD CONSTRAINT pricing_config_nightly_rates_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.pricing_config(id) ON DELETE CASCADE;

COMMIT;
