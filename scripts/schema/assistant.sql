BEGIN;

CREATE TABLE public.payload_mcp_api_keys (
    id integer NOT NULL,
    user_id integer NOT NULL,
    label character varying,
    description character varying,
    places_find boolean DEFAULT false,
    places_create boolean DEFAULT false,
    places_update boolean DEFAULT false,
    guides_find boolean DEFAULT false,
    guides_create boolean DEFAULT false,
    guides_update boolean DEFAULT false,
    testimonials_find boolean DEFAULT false,
    testimonials_create boolean DEFAULT false,
    testimonials_update boolean DEFAULT false,
    amenities_find boolean DEFAULT false,
    amenities_create boolean DEFAULT false,
    amenities_update boolean DEFAULT false,
    official_sites_find boolean DEFAULT false,
    official_sites_create boolean DEFAULT false,
    official_sites_update boolean DEFAULT false,
    media_find boolean DEFAULT false,
    home_page_find boolean DEFAULT false,
    home_page_update boolean DEFAULT false,
    cottage_page_find boolean DEFAULT false,
    cottage_page_update boolean DEFAULT false,
    surroundings_page_find boolean DEFAULT false,
    surroundings_page_update boolean DEFAULT false,
    guides_page_find boolean DEFAULT false,
    guides_page_update boolean DEFAULT false,
    rates_page_find boolean DEFAULT false,
    rates_page_update boolean DEFAULT false,
    contact_page_find boolean DEFAULT false,
    contact_page_update boolean DEFAULT false,
    site_settings_find boolean DEFAULT false,
    site_settings_update boolean DEFAULT false,
    pricing_config_find boolean DEFAULT false,
    pricing_config_update boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    enable_a_p_i_key boolean,
    api_key character varying,
    api_key_index character varying
);

CREATE SEQUENCE public.payload_mcp_api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_mcp_api_keys_id_seq OWNED BY public.payload_mcp_api_keys.id;

ALTER TABLE public.payload_preferences_rels ADD COLUMN payload_mcp_api_keys_id integer;

ALTER TABLE ONLY public.payload_mcp_api_keys ALTER COLUMN id SET DEFAULT nextval('public.payload_mcp_api_keys_id_seq'::regclass);

ALTER TABLE ONLY public.payload_mcp_api_keys
    ADD CONSTRAINT payload_mcp_api_keys_pkey PRIMARY KEY (id);

CREATE INDEX payload_mcp_api_keys_created_at_idx ON public.payload_mcp_api_keys USING btree (created_at);

CREATE INDEX payload_mcp_api_keys_updated_at_idx ON public.payload_mcp_api_keys USING btree (updated_at);

CREATE INDEX payload_mcp_api_keys_user_idx ON public.payload_mcp_api_keys USING btree (user_id);

CREATE INDEX payload_preferences_rels_payload_mcp_api_keys_id_idx ON public.payload_preferences_rels USING btree (payload_mcp_api_keys_id);

ALTER TABLE ONLY public.payload_mcp_api_keys
    ADD CONSTRAINT payload_mcp_api_keys_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_payload_mcp_api_keys_fk FOREIGN KEY (payload_mcp_api_keys_id) REFERENCES public.payload_mcp_api_keys(id) ON DELETE CASCADE;

COMMIT;
