BEGIN;

CREATE TYPE public.enum__contact_page_v_version_form_dates_field AS ENUM (
    'hidden',
    'optional',
    'required'
);

CREATE TYPE public.enum__contact_page_v_version_form_phone_field AS ENUM (
    'hidden',
    'optional',
    'required'
);

CREATE TYPE public.enum_contact_page_form_dates_field AS ENUM (
    'hidden',
    'optional',
    'required'
);

CREATE TYPE public.enum_contact_page_form_phone_field AS ENUM (
    'hidden',
    'optional',
    'required'
);

CREATE TYPE public.enum_exports_drafts AS ENUM (
    'yes',
    'no'
);

CREATE TYPE public.enum_exports_format AS ENUM (
    'csv',
    'json'
);

CREATE TYPE public.enum_exports_locale AS ENUM (
    'all',
    'fr',
    'en'
);

CREATE TYPE public.enum_exports_sort_order AS ENUM (
    'asc',
    'desc'
);

CREATE TYPE public.enum_imports_import_mode AS ENUM (
    'create',
    'update',
    'upsert'
);

CREATE TYPE public.enum_imports_status AS ENUM (
    'pending',
    'completed',
    'partial',
    'failed'
);

CREATE TYPE public.enum_payload_jobs_log_state AS ENUM (
    'failed',
    'succeeded'
);

CREATE TYPE public.enum_payload_jobs_log_task_slug AS ENUM (
    'inline',
    'createCollectionExport',
    'createCollectionImport',
    'schedulePublish'
);

CREATE TYPE public.enum_payload_jobs_task_slug AS ENUM (
    'inline',
    'createCollectionExport',
    'createCollectionImport',
    'schedulePublish'
);

CREATE TYPE public.enum_redirects_to_type AS ENUM (
    'reference',
    'custom'
);

ALTER TABLE public._contact_page_v ADD COLUMN version_form_phone_field public.enum__contact_page_v_version_form_phone_field DEFAULT 'optional'::public.enum__contact_page_v_version_form_phone_field;
ALTER TABLE public._contact_page_v ADD COLUMN version_form_dates_field public.enum__contact_page_v_version_form_dates_field DEFAULT 'optional'::public.enum__contact_page_v_version_form_dates_field;

ALTER TABLE public._contact_page_v_locales ADD COLUMN version_form_dates_hint character varying;
ALTER TABLE public._contact_page_v_locales ADD COLUMN version_form_sent_title character varying;
ALTER TABLE public._contact_page_v_locales ADD COLUMN version_form_sent_text character varying;

ALTER TABLE public._guides_v ADD COLUMN version_deleted_at timestamp(3) with time zone;

ALTER TABLE public.amenities ADD COLUMN deleted_at timestamp(3) with time zone;

ALTER TABLE public.contact_messages ADD COLUMN deleted_at timestamp(3) with time zone;

ALTER TABLE public.contact_page ADD COLUMN form_phone_field public.enum_contact_page_form_phone_field DEFAULT 'optional'::public.enum_contact_page_form_phone_field;
ALTER TABLE public.contact_page ADD COLUMN form_dates_field public.enum_contact_page_form_dates_field DEFAULT 'optional'::public.enum_contact_page_form_dates_field;

ALTER TABLE public.contact_page_locales ADD COLUMN form_dates_hint character varying;
ALTER TABLE public.contact_page_locales ADD COLUMN form_sent_title character varying;
ALTER TABLE public.contact_page_locales ADD COLUMN form_sent_text character varying;

CREATE TABLE public.exports (
    id integer NOT NULL,
    name character varying,
    format public.enum_exports_format DEFAULT 'csv'::public.enum_exports_format NOT NULL,
    "limit" numeric,
    page numeric DEFAULT 1,
    sort character varying,
    sort_order public.enum_exports_sort_order,
    locale public.enum_exports_locale DEFAULT 'all'::public.enum_exports_locale,
    drafts public.enum_exports_drafts DEFAULT 'yes'::public.enum_exports_drafts,
    collection_slug character varying DEFAULT 'contact-messages'::character varying NOT NULL,
    "where" jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);

CREATE SEQUENCE public.exports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.exports_id_seq OWNED BY public.exports.id;

CREATE TABLE public.exports_texts (
    id integer NOT NULL,
    "order" integer NOT NULL,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    text character varying
);

CREATE SEQUENCE public.exports_texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.exports_texts_id_seq OWNED BY public.exports_texts.id;

ALTER TABLE public.guides ADD COLUMN deleted_at timestamp(3) with time zone;

CREATE TABLE public.imports (
    id integer NOT NULL,
    collection_slug character varying NOT NULL,
    import_mode public.enum_imports_import_mode,
    match_field character varying DEFAULT 'id'::character varying,
    status public.enum_imports_status DEFAULT 'pending'::public.enum_imports_status,
    summary_imported numeric,
    summary_updated numeric,
    summary_total numeric,
    summary_issues numeric,
    summary_issue_details jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);

CREATE SEQUENCE public.imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.imports_id_seq OWNED BY public.imports.id;

ALTER TABLE public.media ADD COLUMN deleted_at timestamp(3) with time zone;

ALTER TABLE public.official_sites ADD COLUMN deleted_at timestamp(3) with time zone;

CREATE TABLE public.payload_jobs (
    id integer NOT NULL,
    input jsonb,
    completed_at timestamp(3) with time zone,
    total_tried numeric DEFAULT 0,
    has_error boolean DEFAULT false,
    error jsonb,
    task_slug public.enum_payload_jobs_task_slug,
    queue character varying DEFAULT 'default'::character varying,
    wait_until timestamp(3) with time zone,
    processing boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE SEQUENCE public.payload_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.payload_jobs_id_seq OWNED BY public.payload_jobs.id;

CREATE TABLE public.payload_jobs_log (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    executed_at timestamp(3) with time zone NOT NULL,
    completed_at timestamp(3) with time zone NOT NULL,
    task_slug public.enum_payload_jobs_log_task_slug NOT NULL,
    task_i_d character varying NOT NULL,
    input jsonb,
    output jsonb,
    state public.enum_payload_jobs_log_state NOT NULL,
    error jsonb
);

ALTER TABLE public.places ADD COLUMN deleted_at timestamp(3) with time zone;

CREATE TABLE public.redirects (
    id integer NOT NULL,
    "from" character varying NOT NULL,
    to_type public.enum_redirects_to_type DEFAULT 'reference'::public.enum_redirects_to_type,
    to_url character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp(3) with time zone
);

CREATE SEQUENCE public.redirects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.redirects_id_seq OWNED BY public.redirects.id;

CREATE TABLE public.redirects_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    guides_id integer
);

CREATE SEQUENCE public.redirects_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.redirects_rels_id_seq OWNED BY public.redirects_rels.id;

ALTER TABLE public.testimonials ADD COLUMN deleted_at timestamp(3) with time zone;

ALTER TABLE ONLY public.exports ALTER COLUMN id SET DEFAULT nextval('public.exports_id_seq'::regclass);

ALTER TABLE ONLY public.exports_texts ALTER COLUMN id SET DEFAULT nextval('public.exports_texts_id_seq'::regclass);

ALTER TABLE ONLY public.imports ALTER COLUMN id SET DEFAULT nextval('public.imports_id_seq'::regclass);

ALTER TABLE ONLY public.payload_jobs ALTER COLUMN id SET DEFAULT nextval('public.payload_jobs_id_seq'::regclass);

ALTER TABLE ONLY public.redirects ALTER COLUMN id SET DEFAULT nextval('public.redirects_id_seq'::regclass);

ALTER TABLE ONLY public.redirects_rels ALTER COLUMN id SET DEFAULT nextval('public.redirects_rels_id_seq'::regclass);

ALTER TABLE ONLY public.exports
    ADD CONSTRAINT exports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.exports_texts
    ADD CONSTRAINT exports_texts_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_jobs_log
    ADD CONSTRAINT payload_jobs_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.payload_jobs
    ADD CONSTRAINT payload_jobs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.redirects
    ADD CONSTRAINT redirects_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_pkey PRIMARY KEY (id);

CREATE INDEX _guides_v_version_version_deleted_at_idx ON public._guides_v USING btree (version_deleted_at);

CREATE INDEX amenities_deleted_at_idx ON public.amenities USING btree (deleted_at);

CREATE INDEX contact_messages_deleted_at_idx ON public.contact_messages USING btree (deleted_at);

CREATE INDEX exports_created_at_idx ON public.exports USING btree (created_at);

CREATE UNIQUE INDEX exports_filename_idx ON public.exports USING btree (filename);

CREATE INDEX exports_texts_order_parent ON public.exports_texts USING btree ("order", parent_id);

CREATE INDEX exports_updated_at_idx ON public.exports USING btree (updated_at);

CREATE INDEX guides_deleted_at_idx ON public.guides USING btree (deleted_at);

CREATE INDEX imports_created_at_idx ON public.imports USING btree (created_at);

CREATE UNIQUE INDEX imports_filename_idx ON public.imports USING btree (filename);

CREATE INDEX imports_updated_at_idx ON public.imports USING btree (updated_at);

CREATE INDEX media_deleted_at_idx ON public.media USING btree (deleted_at);

CREATE INDEX official_sites_deleted_at_idx ON public.official_sites USING btree (deleted_at);

CREATE INDEX payload_jobs_completed_at_idx ON public.payload_jobs USING btree (completed_at);

CREATE INDEX payload_jobs_created_at_idx ON public.payload_jobs USING btree (created_at);

CREATE INDEX payload_jobs_has_error_idx ON public.payload_jobs USING btree (has_error);

CREATE INDEX payload_jobs_log_order_idx ON public.payload_jobs_log USING btree (_order);

CREATE INDEX payload_jobs_log_parent_id_idx ON public.payload_jobs_log USING btree (_parent_id);

CREATE INDEX payload_jobs_processing_idx ON public.payload_jobs USING btree (processing);

CREATE INDEX payload_jobs_queue_idx ON public.payload_jobs USING btree (queue);

CREATE INDEX payload_jobs_task_slug_idx ON public.payload_jobs USING btree (task_slug);

CREATE INDEX payload_jobs_total_tried_idx ON public.payload_jobs USING btree (total_tried);

CREATE INDEX payload_jobs_updated_at_idx ON public.payload_jobs USING btree (updated_at);

CREATE INDEX payload_jobs_wait_until_idx ON public.payload_jobs USING btree (wait_until);

CREATE INDEX places_deleted_at_idx ON public.places USING btree (deleted_at);

CREATE INDEX redirects_created_at_idx ON public.redirects USING btree (created_at);

CREATE INDEX redirects_deleted_at_idx ON public.redirects USING btree (deleted_at);

CREATE UNIQUE INDEX redirects_from_idx ON public.redirects USING btree ("from");

CREATE INDEX redirects_rels_guides_id_idx ON public.redirects_rels USING btree (guides_id);

CREATE INDEX redirects_rels_order_idx ON public.redirects_rels USING btree ("order");

CREATE INDEX redirects_rels_parent_idx ON public.redirects_rels USING btree (parent_id);

CREATE INDEX redirects_rels_path_idx ON public.redirects_rels USING btree (path);

CREATE INDEX redirects_updated_at_idx ON public.redirects USING btree (updated_at);

CREATE INDEX testimonials_deleted_at_idx ON public.testimonials USING btree (deleted_at);

ALTER TABLE ONLY public.exports_texts
    ADD CONSTRAINT exports_texts_parent_fk FOREIGN KEY (parent_id) REFERENCES public.exports(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.payload_jobs_log
    ADD CONSTRAINT payload_jobs_log_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.payload_jobs(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_guides_fk FOREIGN KEY (guides_id) REFERENCES public.guides(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.redirects_rels
    ADD CONSTRAINT redirects_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.redirects(id) ON DELETE CASCADE;

COMMIT;
