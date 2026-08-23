export type DatasetTheme =
  | "Glaciology"
  | "Atmospheric Science"
  | "Oceanography"
  | "Biology & Ecology"
  | "Geology & Geophysics";

export type AccessLevel = "open" | "registered" | "restricted";

export interface DatasetFile {
  name: string;
  format: string;
  sizeMb: number;
  checksum: string;
}

export interface Dataset {
  id: string;
  doi: string;
  title: string;
  theme: DatasetTheme;
  region: string;
  expeditionCode: string;
  pi: string;
  institution: string;
  published: string;
  temporalStart: string;
  temporalEnd: string;
  bbox: [number, number, number, number];
  keywords: string[];
  license: string;
  access: AccessLevel;
  downloads: number;
  citations: number;
  version: string;
  abstract: string;
  variables: string[];
  files: DatasetFile[];
}

export const datasets: Dataset[] = [
  {
    id: "ds-maitri-awx-2024",
    doi: "10.5281/ncpor.2025.0114",
    title: "Maitri station surface energy balance and meteorology, 2024-25 austral summer",
    theme: "Atmospheric Science",
    region: "Antarctic — Schirmacher Oasis",
    expeditionCode: "ISEA-44",
    pi: "Dr. Kavya Iyer",
    institution: "IITM Pune / NCPOR",
    published: "2025-05-19",
    temporalStart: "2024-11-12",
    temporalEnd: "2025-03-21",
    bbox: [11.5, -70.9, 12.1, -70.6],
    keywords: ["surface energy balance", "katabatic wind", "radiation flux", "AWS"],
    license: "CC BY 4.0",
    access: "open",
    downloads: 1284,
    citations: 7,
    version: "v2.1",
    abstract:
      "Ten-minute resolution records from three automatic weather stations around Maitri, including four-component radiation, wind profile at 2 m and 10 m, snow-surface temperature and turbulent flux estimates derived by the bulk aerodynamic method. Quality flags follow the WMO CIMO guidance and gap-filling is documented per channel.",
    variables: [
      "air_temperature",
      "relative_humidity",
      "wind_speed",
      "wind_direction",
      "shortwave_in",
      "shortwave_out",
      "longwave_in",
      "longwave_out",
      "surface_pressure",
    ],
    files: [
      {
        name: "maitri_aws_10min_2024-25.nc",
        format: "NetCDF-4",
        sizeMb: 214.6,
        checksum: "sha256:8b41c2…d907",
      },
      {
        name: "maitri_aws_daily_summary.csv",
        format: "CSV",
        sizeMb: 3.2,
        checksum: "sha256:1fa77e…4b12",
      },
      { name: "readme_and_qc_notes.pdf", format: "PDF", sizeMb: 1.1, checksum: "sha256:9c0d3a…77ef" },
    ],
  },
  {
    id: "ds-firn-core-pc4403",
    doi: "10.5281/ncpor.2025.0128",
    title: "Firn core PC-44/03 stable isotope and black carbon stratigraphy, Sør Rondane foothills",
    theme: "Glaciology",
    region: "Antarctic — Queen Maud Land",
    expeditionCode: "ISEA-44",
    pi: "Dr. Anirban Sen",
    institution: "NCPOR, Goa",
    published: "2025-07-02",
    temporalStart: "1815-01-01",
    temporalEnd: "2025-01-14",
    bbox: [10.9, -72.1, 11.4, -71.8],
    keywords: ["firn core", "delta-18O", "black carbon", "accumulation rate"],
    license: "CC BY-NC 4.0",
    access: "registered",
    downloads: 402,
    citations: 3,
    version: "v1.0",
    abstract:
      "Discrete 5 cm sample measurements of δ18O, δD and refractory black carbon along a 68.4 m firn core, with annual layer counting, density profile and derived accumulation rates spanning approximately 210 years. Includes laboratory blanks and inter-comparison against a co-located 2019 core.",
    variables: ["delta_18O", "delta_D", "rBC_concentration", "density", "depth", "annual_layer_id"],
    files: [
      { name: "pc4403_isotopes.csv", format: "CSV", sizeMb: 6.4, checksum: "sha256:44de91…0a55" },
      { name: "pc4403_density_profile.csv", format: "CSV", sizeMb: 0.8, checksum: "sha256:ba21c7…9910" },
      {
        name: "pc4403_methods.pdf",
        format: "PDF",
        sizeMb: 2.4,
        checksum: "sha256:07ee52…31cd",
      },
    ],
  },
  {
    id: "ds-gnss-bedrock-uplift",
    doi: "10.5281/ncpor.2025.0131",
    title: "GNSS bedrock benchmark time series for glacial isostatic adjustment, Queen Maud Land",
    theme: "Geology & Geophysics",
    region: "Antarctic — Queen Maud Land",
    expeditionCode: "ISEA-44",
    pi: "Dr. Meenakshi Rawat",
    institution: "NCPOR, Goa",
    published: "2025-06-11",
    temporalStart: "2012-12-02",
    temporalEnd: "2025-02-27",
    bbox: [10.5, -72.4, 12.6, -70.4],
    keywords: ["GNSS", "glacial isostatic adjustment", "crustal uplift", "geodesy"],
    license: "CC BY 4.0",
    access: "open",
    downloads: 738,
    citations: 12,
    version: "v4.0",
    abstract:
      "Daily position solutions for twelve bedrock benchmarks processed in the ITRF2020 reference frame, with vertical rate estimates and formal uncertainties. Suitable for constraining regional GIA models and for correcting satellite gravimetry mass-balance estimates.",
    variables: ["east_mm", "north_mm", "up_mm", "sigma_up", "station_id"],
    files: [
      { name: "qml_gnss_daily_itrf2020.zip", format: "ZIP (SINEX + CSV)", sizeMb: 88.3, checksum: "sha256:c2f80b…6ad4" },
      { name: "vertical_rates_summary.csv", format: "CSV", sizeMb: 0.1, checksum: "sha256:e91a44…2b70" },
    ],
  },
  {
    id: "ds-kongsfjorden-ctd",
    doi: "10.5281/ncpor.2025.0207",
    title: "Kongsfjorden hydrographic transect CTD profiles, Arctic summer 2025",
    theme: "Oceanography",
    region: "Arctic — Kongsfjorden, Svalbard",
    expeditionCode: "IARC-2025",
    pi: "Dr. Sanjana Pillai",
    institution: "NCPOR, Goa",
    published: "2025-10-08",
    temporalStart: "2025-05-27",
    temporalEnd: "2025-08-29",
    bbox: [11.3, 78.85, 12.7, 79.05],
    keywords: ["CTD", "fjord", "meltwater", "Atlantic water intrusion"],
    license: "CC BY 4.0",
    access: "open",
    downloads: 951,
    citations: 5,
    version: "v1.2",
    abstract:
      "Sixty-two CTD casts along a nine-station inner-to-outer fjord transect, capturing surface freshening from glacial discharge and the sub-surface signature of Atlantic Water inflow. Salinity calibrated against bottle samples; oxygen sensor drift corrected per cast series.",
    variables: ["pressure", "temperature", "salinity", "dissolved_oxygen", "turbidity", "fluorescence"],
    files: [
      { name: "kongsfjorden_ctd_2025.nc", format: "NetCDF-4", sizeMb: 47.9, checksum: "sha256:5a7b19…c30f" },
      { name: "station_metadata.csv", format: "CSV", sizeMb: 0.2, checksum: "sha256:3311ba…ff09" },
    ],
  },
  {
    id: "ds-himadri-bc-aerosol",
    doi: "10.5281/ncpor.2025.0219",
    title: "Equivalent black carbon and aerosol optical properties at Himadri, Ny-Ålesund",
    theme: "Atmospheric Science",
    region: "Arctic — Ny-Ålesund, Svalbard",
    expeditionCode: "IARC-2025",
    pi: "Dr. Yusuf Khan",
    institution: "PRL Ahmedabad",
    published: "2025-10-22",
    temporalStart: "2025-05-20",
    temporalEnd: "2025-09-01",
    bbox: [11.85, 78.9, 12.0, 78.95],
    keywords: ["black carbon", "aethalometer", "Arctic haze", "long-range transport"],
    license: "CC BY 4.0",
    access: "open",
    downloads: 610,
    citations: 4,
    version: "v1.0",
    abstract:
      "Hourly equivalent black carbon mass concentrations from a seven-wavelength aethalometer with loading correction, plus nephelometer scattering coefficients and derived Ångström exponents. Includes flags for local pollution from settlement activity and vessel traffic.",
    variables: ["eBC_ng_m3", "babs_370_950nm", "scattering_coefficient", "angstrom_exponent"],
    files: [
      { name: "himadri_ebc_hourly_2025.csv", format: "CSV", sizeMb: 12.7, checksum: "sha256:66d0aa…1e83" },
      { name: "local_pollution_flags.csv", format: "CSV", sizeMb: 0.9, checksum: "sha256:aa4f02…7c51" },
    ],
  },
  {
    id: "ds-cryoconite-16s",
    doi: "10.5281/ncpor.2025.0244",
    title: "Cryoconite and meltwater plume microbial diversity, Vestre Broggerbreen",
    theme: "Biology & Ecology",
    region: "Arctic — Brøggerhalvøya, Svalbard",
    expeditionCode: "IARC-2025",
    pi: "Dr. Tenzing Norbu",
    institution: "NCPOR, Goa",
    published: "2025-11-14",
    temporalStart: "2025-06-14",
    temporalEnd: "2025-08-19",
    bbox: [11.6, 78.86, 12.1, 78.94],
    keywords: ["16S rRNA", "cryoconite", "psychrophiles", "amplicon sequencing"],
    license: "CC BY-NC 4.0",
    access: "restricted",
    downloads: 187,
    citations: 2,
    version: "v1.0",
    abstract:
      "Amplicon sequence variant tables and taxonomy assignments from 48 cryoconite hole and proglacial meltwater samples, with paired physicochemical measurements. Raw reads are mirrored to a public sequence archive; access here is granted for the curated ASV tables and unpublished metadata.",
    variables: ["asv_counts", "taxonomy", "ph", "conductivity", "dissolved_organic_carbon"],
    files: [
      { name: "asv_table_vb2025.tsv", format: "TSV", sizeMb: 18.2, checksum: "sha256:d17f6c…8b40" },
      { name: "sample_physicochemistry.csv", format: "CSV", sizeMb: 0.4, checksum: "sha256:920fbb…5512" },
    ],
  },
  {
    id: "ds-southern-ocean-ctd-57e",
    doi: "10.5281/ncpor.2024.0451",
    title: "Southern Ocean 57°E repeat hydrographic section, full-depth CTD and carbon inventory",
    theme: "Oceanography",
    region: "Southern Ocean — 40°S to 60°S along 57°E",
    expeditionCode: "SOSE-10",
    pi: "Dr. Nandita Bose",
    institution: "NCPOR, Goa",
    published: "2024-09-30",
    temporalStart: "2023-12-19",
    temporalEnd: "2024-02-11",
    bbox: [55.0, -60.5, 59.0, -39.5],
    keywords: ["hydrography", "Antarctic Circumpolar Current", "DIC", "frontal structure"],
    license: "CC BY 4.0",
    access: "open",
    downloads: 1533,
    citations: 21,
    version: "v3.0",
    abstract:
      "Twenty-six full-depth CTD-rosette stations with dissolved inorganic carbon, total alkalinity, nutrients and dissolved oxygen from bottle samples. Frontal positions for the Subtropical, Subantarctic and Polar Fronts are identified from the underway thermosalinograph and gridded section fields.",
    variables: ["temperature", "salinity", "oxygen", "nitrate", "silicate", "phosphate", "DIC", "alkalinity"],
    files: [
      { name: "so57e_ctd_fulldepth.nc", format: "NetCDF-4", sizeMb: 322.5, checksum: "sha256:71bd08…ac67" },
      { name: "so57e_bottle_data.csv", format: "CSV", sizeMb: 4.8, checksum: "sha256:cc19d4…3f28" },
      { name: "frontal_positions.geojson", format: "GeoJSON", sizeMb: 0.3, checksum: "sha256:f0a731…be95" },
    ],
  },
  {
    id: "ds-argo-deployments",
    doi: "10.5281/ncpor.2024.0468",
    title: "Indian Argo and BGC-Argo float deployment metadata, Indian sector of the Southern Ocean",
    theme: "Oceanography",
    region: "Southern Ocean — Indian sector",
    expeditionCode: "SOSE-10",
    pi: "Dr. Farida Sheikh",
    institution: "INCOIS Hyderabad",
    published: "2024-10-15",
    temporalStart: "2016-01-08",
    temporalEnd: "2024-02-09",
    bbox: [30.0, -65.0, 90.0, -30.0],
    keywords: ["Argo", "BGC-Argo", "float metadata", "profiling floats"],
    license: "CC0 1.0",
    access: "open",
    downloads: 864,
    citations: 9,
    version: "v6.1",
    abstract:
      "Deployment positions, platform configurations, sensor payloads and first-profile diagnostics for 74 profiling floats released by Indian expeditions, cross-referenced to WMO identifiers for retrieval from the global Argo data system.",
    variables: ["wmo_id", "deployment_lat", "deployment_lon", "platform_type", "sensor_payload"],
    files: [
      { name: "argo_deployments_india.csv", format: "CSV", sizeMb: 0.6, checksum: "sha256:2b8ce0…7741" },
    ],
  },
  {
    id: "ds-chandra-mass-balance",
    doi: "10.5281/ncpor.2025.0072",
    title: "Chandra basin glacier mass balance stake network, 2016-2024",
    theme: "Glaciology",
    region: "Himalaya — Chandra basin, Lahaul-Spiti",
    expeditionCode: "HICRYO-2024",
    pi: "Dr. Ishaan Verma",
    institution: "NCPOR, Goa",
    published: "2025-03-07",
    temporalStart: "2016-09-01",
    temporalEnd: "2024-09-30",
    bbox: [77.3, 32.2, 77.9, 32.6],
    keywords: ["mass balance", "ablation stakes", "Sutri Dhaka", "third pole"],
    license: "CC BY 4.0",
    access: "open",
    downloads: 1102,
    citations: 18,
    version: "v5.0",
    abstract:
      "Annual and seasonal specific mass balance for four glaciers derived from 112 ablation stakes and 22 accumulation pits, with snow density measurements, stake coordinates and uncertainty estimates propagated by the glaciological method.",
    variables: ["stake_id", "elevation", "ablation_cm", "snow_density", "specific_mass_balance"],
    files: [
      { name: "chandra_stake_measurements.csv", format: "CSV", sizeMb: 2.9, checksum: "sha256:5510ee…a20b" },
      { name: "glacier_balance_summary.csv", format: "CSV", sizeMb: 0.1, checksum: "sha256:8def13…c604" },
    ],
  },
  {
    id: "ds-sutri-dhaka-dem",
    doi: "10.5281/ncpor.2025.0088",
    title: "Sutri Dhaka glacier UAV photogrammetric DEM and orthomosaic, 2024",
    theme: "Glaciology",
    region: "Himalaya — Chandra basin, Lahaul-Spiti",
    expeditionCode: "HICRYO-2024",
    pi: "Dr. Aruna Devi",
    institution: "WIHG Dehradun",
    published: "2025-04-21",
    temporalStart: "2024-09-12",
    temporalEnd: "2024-09-16",
    bbox: [77.5, 32.36, 77.72, 32.48],
    keywords: ["UAV", "DEM", "orthomosaic", "debris cover", "photogrammetry"],
    license: "CC BY 4.0",
    access: "registered",
    downloads: 329,
    citations: 6,
    version: "v1.1",
    abstract:
      "A 0.15 m digital elevation model and 3.2 cm orthomosaic covering 11.4 km² of the Sutri Dhaka glacier tongue, produced by structure-from-motion from 4,180 UAV frames with 14 GNSS ground control points. Includes an accuracy report and debris-cover classification raster.",
    variables: ["elevation", "orthophoto_rgb", "debris_class"],
    files: [
      { name: "sutri_dhaka_dem_15cm.tif", format: "GeoTIFF", sizeMb: 1840.0, checksum: "sha256:31c9aa…08fe" },
      { name: "sutri_dhaka_ortho_3cm.tif", format: "GeoTIFF", sizeMb: 4210.0, checksum: "sha256:7a02bd…dd19" },
      { name: "accuracy_report.pdf", format: "PDF", sizeMb: 3.6, checksum: "sha256:be5514…1177" },
    ],
  },
];

export const themes: DatasetTheme[] = [
  "Glaciology",
  "Atmospheric Science",
  "Oceanography",
  "Biology & Ecology",
  "Geology & Geophysics",
];

export const accessLevels: { value: AccessLevel; label: string; help: string }[] = [
  { value: "open", label: "Open access", help: "Downloadable by anyone under the stated licence." },
  {
    value: "registered",
    label: "Registered users",
    help: "Requires a verified portal account; download is logged.",
  },
  {
    value: "restricted",
    label: "Restricted",
    help: "Data-access request reviewed by the principal investigator.",
  },
];

export function getDataset(id: string) {
  return datasets.find((d) => d.id === id);
}

export interface DatasetQuery {
  q?: string | undefined;
  theme?: string | undefined;
  region?: string | undefined;
  access?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  sort?: "relevance" | "recent" | "downloads" | "citations" | undefined;
}

export function searchDatasets(query: DatasetQuery): Dataset[] {
  const q = (query.q ?? "").trim().toLowerCase();
  let results = datasets.filter((d) => {
    if (query.theme && query.theme !== "all" && d.theme !== query.theme) return false;
    if (query.region && query.region !== "all" && !d.region.startsWith(query.region)) return false;
    if (query.access && query.access !== "all" && d.access !== query.access) return false;
    if (query.from && d.published < query.from) return false;
    if (query.to && d.published > query.to) return false;
    if (!q) return true;
    const haystack = [
      d.title,
      d.abstract,
      d.pi,
      d.institution,
      d.region,
      d.expeditionCode,
      d.doi,
      ...d.keywords,
      ...d.variables,
    ]
      .join(" ")
      .toLowerCase();
    return q.split(/\s+/).every((token) => haystack.includes(token));
  });

  switch (query.sort) {
    case "recent":
      results = [...results].sort((a, b) => b.published.localeCompare(a.published));
      break;
    case "downloads":
      results = [...results].sort((a, b) => b.downloads - a.downloads);
      break;
    case "citations":
      results = [...results].sort((a, b) => b.citations - a.citations);
      break;
    default:
      break;
  }
  return results;
}

export const regionFacets = [
  "Antarctic",
  "Arctic",
  "Southern Ocean",
  "Himalaya",
];
