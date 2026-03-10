# WARN Act & Government Data Source Directory

Comprehensive directory of all US state WARN Act databases, territory labor departments, and federal workforce data sources for tracking AI-related layoffs.

Last updated: 2026-03-11

---

## Multi-State Aggregators

These pull from individual state databases and normalize the data. Start here before scraping individual states.

| Source | URL | Notes |
|--------|-----|-------|
| **WARN Firehose** | https://warnfirehose.com/data/layoffs | 86,691+ filings, all 50 states, daily updates. Has MCP server |
| **LayoffData.com** | https://layoffdata.com/data/ | 49 states & territories, 81,000+ notices, 8.7M+ workers. Searchable by state/company |
| **WARNTracker.com** | https://www.warntracker.com/ | Live layoffs from public WARN records. Filter by state, year (back to 1990) |
| **warn-scraper (Stanford)** | https://github.com/biglocalnews/warn-scraper | Python CLI scraper for all state WARN sites. Open source, automated via GitHub Actions |
| **warn-transformer** | https://github.com/biglocalnews/warn-transformer | ETL pipeline to consolidate/enrich warn-scraper output |
| **0xdade Gist** | https://gist.github.com/0xdade/c90d11a7f2d2591ad0a980b9c7ed232f | Aggregation of state WARN URLs (work in progress) |
| **WARNActNews.com** | https://www.warnactnews.com/ | State-specific WARN pages, news coverage |

---

## All 50 States + DC

| State | Agency | URL | Notes |
|-------|--------|-----|-------|
| **Alabama** | Dept. of Labor | https://labor.alabama.gov/ | No public WARN database found. Contact agency directly |
| **Alaska** | Dept. of Labor & Workforce Dev. | https://jobs.state.ak.us/RR/WARN_notices.htm | WARN notices list |
| **Arizona** | Dept. of Economic Security / ARIZONA@WORK | https://www.azjobconnection.gov/warn_info | Searchable WARN list. Also: https://arizonaatwork.com/explore-services/rapid-response |
| **Arkansas** | Div. of Workforce Services | https://dws.arkansas.gov/workforce-services/employers/dislocated-worker-services/ | Rapid Response page, contact for WARN data |
| **California** | Employment Development Dept. (EDD) | https://edd.ca.gov/en/jobs_and_training/Layoff_Services_WARN/ | Extensive database. PDFs by year, searchable by company/location. State mini-WARN (75+ employees) |
| **Colorado** | Dept. of Labor & Employment | https://cdle.colorado.gov/employers/layoff-separations/layoff-warn-list | Downloadable WARN listings |
| **Connecticut** | Dept. of Labor | https://www.ctdol.state.ct.us/progsupt/bussrvce/warnreports/warnreports.htm | Monthly WARN reports, annual listings (2017-2025+). Also: https://portal.ct.gov/dol/knowledge-base/articles/employment-and-training/rapid-response/warn |
| **Delaware** | Dept. of Labor / Delaware JobLink | https://joblink.delaware.gov/search/warn_lookups/new | Searchable WARN database. State mini-WARN enacted |
| **Florida** | Dept. of Economic Opportunity | https://floridajobs.org/office-directory/division-of-workforce-services/workforce-programs/reemployment-and-emergency-assistance-coordination-team-react/warn-notices | WARN notices list via REACT team |
| **Georgia** | Technical College System of Georgia (TCSG) | https://www.tcsg.edu/warn/ | Layoff & Closure Notification Form. Also: https://www.dol.state.ga.us/Access/Service/WarnIDListingInput |
| **Hawaii** | Dept. of Labor & Industrial Relations | https://labor.hawaii.gov/wdc/the-warn-act/ | Workforce Development Council page. State mini-WARN |
| **Idaho** | Dept. of Labor | https://labor.idaho.gov/dnn/Businesses/Layoff-Assistance | Layoff assistance page with WARN info |
| **Illinois** | Dept. of Commerce & Economic Opportunity | https://dceo.illinois.gov/workforcedevelopment/warn.html | Searchable WARN notices. State mini-WARN |
| **Indiana** | Dept. of Workforce Development | https://www.in.gov/dwd/warn-notices/ | WARN notices list |
| **Iowa** | Workforce Development | https://workforce.iowa.gov/employers/resources/warn | WARN info and notices. State mini-WARN (30-day notice, state-specific rules) |
| **Kansas** | Dept. of Commerce | https://www.kansascommerce.gov/ | Contact Workforce Services division. State mini-WARN |
| **Kentucky** | Kentucky Career Center / KY Works | https://kcc.ky.gov/employer/Pages/Business-Downsizing-Assistance---WARN.aspx | WARN notices by year. Also: https://kyworks.ky.gov/Services/Pages/Rapid-Response-Layoffs-and-Closures.aspx |
| **Louisiana** | Louisiana Workforce Commission | https://www.laworks.net/WorkforceDev/WFD_WARNSampleLetter.asp | WARN contact/submission info. No state mini-WARN |
| **Maine** | Dept. of Labor | https://www.maine.gov/labor/ | State mini-WARN (90-day notice requirement + severance) |
| **Maryland** | Div. of Workforce Dev. & Adult Learning | https://labor.maryland.gov/employment/warn.shtml | WARN notices list. State requires 60-day notice for relocations/closings |
| **Massachusetts** | Executive Office of Labor & Workforce Dev. | https://www.mass.gov/info-details/worker-adjustment-and-retraining-notification-act-warn | WARN info page. State mini-WARN |
| **Michigan** | Labor & Economic Opportunity (LEO) | https://www.michigan.gov/leo/bureaus-agencies/wd/data-public-notices/warn-notices | Public WARN notices list. State mini-WARN |
| **Minnesota** | Dept. of Employment & Economic Dev. (DEED) | https://mn.gov/deed/warn/ | WARN database. State mini-WARN (50+ employees, broader than federal) |
| **Mississippi** | Dept. of Employment Security | https://mdes.ms.gov/information-center/warn-information/ | WARN information page |
| **Missouri** | Office of Workforce Development | https://jobs.mo.gov/employer/warn | WARN notices. Annual reports by year: https://jobs.mo.gov/warn/2023 |
| **Montana** | Dept. of Labor & Industry | https://wsd.dli.mt.gov/wioa/related-links/warn-notice-page | WARN notice page. State law applies only to government facilities |
| **Nebraska** | Dept. of Labor | https://dol.nebraska.gov/ReemploymentServices/LayoffServices/LayoffsAndDownsizingWARN | WARN listing |
| **Nevada** | Dept. of Employment, Training & Rehabilitation | https://detr.nv.gov/ | Contact DETR for WARN data |
| **New Hampshire** | Employment Security (NHES) | https://www.nhes.nh.gov/services/employers/compliance.htm | Employers must report layoffs of 25+ individuals. State mini-WARN |
| **New Jersey** | Dept. of Labor & Workforce Development | https://www.nj.gov/labor/ | State mini-WARN (90-day notice, 50+ employees). Contact for WARN list |
| **New Mexico** | Dept. of Workforce Solutions | https://www.dws.state.nm.us/ | No state mini-WARN. Contact Rapid Response |
| **New York** | Dept. of Labor | https://dol.ny.gov/warn-dashboard | Interactive WARN dashboard (filter by county, industry, date). Annual archives. State mini-WARN (90-day notice, 50+ employees) |
| **North Carolina** | Dept. of Commerce | https://www.commerce.nc.gov/data-tools-reports/labor-market-data-tools/workforce-warn-reports | WARN reports. Public documents |
| **North Dakota** | Job Service North Dakota | https://www.jobsnd.com/unemployment-business-tax/employers-guide/employer-responsibilities-employee-separations | State law: 48-hour notice for mass separation (25+ workers) |
| **Ohio** | Dept. of Job & Family Services | https://jfs.ohio.gov/ | WARN notices (1996-present). Individual PDFs. Email: rapdresp@jfs.ohio.gov |
| **Oklahoma** | Oklahoma Works | https://www.employoklahoma.gov/Participants/s/warnnotices | WARN layoff notices list. Also: https://oklahoma.gov/workforce/employers/layoffs.html |
| **Oregon** | Higher Education Coordinating Commission | https://www.oregon.gov/highered/about/workforce/pages/warn.aspx | WARN Act Notifications list. State mini-WARN |
| **Pennsylvania** | Dept. of Labor & Industry | https://www.dli.pa.gov/Individuals/Workforce-Development/warn/Pages/default.aspx | WARN notices. Submit page: https://www.dli.pa.gov/Individuals/Workforce-Development/warn/notices/Pages/default.aspx |
| **Rhode Island** | Dept. of Labor & Training | https://dlt.ri.gov/employers/worker-adjustment-and-retraining-notification-warn | WARN info and notices. State mini-WARN |
| **South Carolina** | Dept. of Employment & Workforce / SC Works | https://scworks.org/employer/employer-programs/worker-adjustment-and-retraining-notification-warn-act | WARN info. Email: rr@dew.sc.gov. State mini-WARN |
| **South Dakota** | Dept. of Labor & Regulation | https://dlr.sd.gov/workforce_services/businesses/warn_notices.aspx | WARN notices. No state mini-WARN |
| **Tennessee** | Dept. of Labor & Workforce Dev. | https://www.tn.gov/workforce/employers/staffing-redirect/layoffs---unemployment/warn-notices.html | WARN notices. State mini-WARN (50-99 employees covered) |
| **Texas** | Texas Workforce Commission | https://www.twc.texas.gov/data-reports/warn-notice | WARN data in Excel format. Plant closures and layoff notices |
| **Utah** | Dept. of Workforce Services | https://jobs.utah.gov/employer/business/warnnotices.html | WARN notices. Email: rapidresponse_warn@utah.gov |
| **Vermont** | Dept. of Labor | https://labor.vermont.gov/ | State has Notice of Potential Layoffs Act (NPLA) + Mass Separation Notification rule |
| **Virginia** | Virginia Employment Commission / Virginia Works | https://www.vec.virginia.gov/warn-notices | WARN notices. Also: https://virginiaworks.gov/warn-notices |
| **Washington** | Employment Security Department | https://esd.wa.gov/employer-requirements/layoffs-and-employee-notifications/worker-adjustment-and-retraining-notification-warn-layoff-and-closure-database | Full searchable database |
| **West Virginia** | WorkForce West Virginia | https://workforcewv.org/public-information/warn-notices | WARN listing. Also: https://workforcewv.org/job-seeker/layoffs-downsizing/warn-listing/ |
| **Wisconsin** | Dept. of Workforce Development | https://dwd.wisconsin.gov/dislocatedworker/warn/ | Layoff notices filed with DWD by year. State mini-WARN |
| **Wyoming** | Dept. of Workforce Services | https://www.wyoming.gov/agencies/workforce-services/ | No state mini-WARN. Contact agency for WARN data |
| **District of Columbia** | Dept. of Employment Services (DOES) | https://does.dc.gov/ | Contact DOES for WARN data |

---

## US Territories

| Territory | Agency | URL | Notes |
|-----------|--------|-----|-------|
| **Puerto Rico** | Dept. of Labor & Human Resources (DTRH) | https://www.trabajo.pr.gov/ | Covered under federal WARN (explicitly in 20 CFR Part 639). Has Unjust Dismissal Act for group layoffs. No state mini-WARN |
| **US Virgin Islands** | Dept. of Labor | https://www.vidol.gov/ | Explicitly covered under federal WARN Act (20 CFR Part 639) |
| **Guam** | Dept. of Labor | https://dol.guam.gov/ | Subject to federal WARN as US territory |
| **American Samoa** | Dept. of Human Resources | https://www.americansamoa.gov/ | Small employer base; federal WARN applies |
| **Northern Mariana Islands** | Dept. of Labor | https://www.marianaslabor.net/ | Federal WARN applies |

---

## Federal Sources

### Department of Labor (DOL)

| Source | URL | Notes |
|--------|-----|-------|
| **WARN Act Compliance (ETA)** | https://www.dol.gov/agencies/eta/layoffs/warn | Federal WARN overview, links to state contacts |
| **Plant Closings & Layoffs** | https://www.dol.gov/general/topic/termination/plantclosings | General resource page |
| **Rapid Response Services (ETA)** | https://www.dol.gov/agencies/eta/layoffs | Employer layoff notification coordination |
| **State Dislocated Worker Contacts** | https://www.dol.gov/agencies/eta/layoffs/contact | Directory of state rapid response contacts |
| **UI Data Dashboard** | https://oui.doleta.gov/unemploy/DataDashboard.asp | Unemployment insurance claims data |
| **Trade Adjustment Assistance (TAA)** | https://www.dol.gov/agencies/eta/tradeact | Trade-related layoff petitions and certifications |
| **State Labor Offices Directory** | https://www.dol.gov/agencies/whd/state/contacts | All state labor department contacts |

### Bureau of Labor Statistics (BLS)

| Dataset | URL | Notes |
|---------|-----|-------|
| **JOLTS (Job Openings & Labor Turnover)** | https://www.bls.gov/jlt/ | Monthly layoffs/discharges, hires, separations data. State-level estimates available |
| **JOLTS State Estimates** | https://www.bls.gov/jlt/jlt_statedata_background.htm | State-by-state JOLTS breakdowns |
| **Current Employment Statistics (CES)** | https://www.bls.gov/ces/ | Monthly payroll employment by industry |
| **QCEW (Quarterly Census of Employment & Wages)** | https://www.bls.gov/cew/ | Establishment-level employment/wages from UI records. 95%+ coverage |
| **BLS Data API** | https://www.bls.gov/bls/api_features.htm | Programmatic access to all BLS series. Free tier available |
| **Employment Situation Summary** | https://www.bls.gov/news.release/empsit.nr0.htm | Monthly jobs report |
| **Occupational Employment & Wage Statistics** | https://www.bls.gov/oes/ | Employment by occupation — useful for tracking AI-affected roles |
| **State Labor Market Contacts** | https://www.bls.gov/bls/ofolist.htm | State LMI office directory |

### Federal Reserve Economic Data (FRED)

| Dataset | URL | Notes |
|---------|-----|-------|
| **Layoffs + BLS Series** | https://fred.stlouisfed.org/tags/series?t=bls%3Blayoffs | 82 series tagged layoffs+BLS |
| **Employment + BLS Series** | https://fred.stlouisfed.org/tags/series?t=bls%3Bemployment | 88,000+ employment data series |
| **Unemployment + BLS Series** | https://fred.stlouisfed.org/tags/series?t=bls%3Bunemployment | 17,821 unemployment series |
| **All BLS Series** | https://fred.stlouisfed.org/tags/series?t=bls | 180,000+ BLS-sourced series |
| **FRED API** | https://fred.stlouisfed.org/docs/api/fred/ | Free API with key. Excellent documentation |
| **FRED Blog** | https://fredblog.stlouisfed.org/ | Analysis and data visualization articles |

### Census Bureau

| Dataset | URL | Notes |
|---------|-----|-------|
| **Employment Data Hub** | https://www.census.gov/topics/employment/data.html | Central employment data page |
| **American Community Survey (ACS)** | https://www.census.gov/programs-surveys/acs.html | Detailed employment, income, occupation data. 5-year estimates |
| **EEO Tabulation** | https://www.census.gov/acs/www/data/eeo-data/ | Employment by race/ethnicity/sex/occupation. From ACS |
| **Equal Employment Opportunity Data** | https://www.census.gov/topics/employment/equal-employment-opportunity-tabulation.html | Workforce composition benchmarks |
| **The Opportunity Project (Workforce)** | https://opportunity.census.gov/data/workforce/ | Workforce-related open datasets |

### EEOC (Equal Employment Opportunity Commission)

| Source | URL | Notes |
|--------|-----|-------|
| **Data & Statistics** | https://www.eeoc.gov/data/data-and-statistics | Charge statistics, litigation data, employer EEO-1 reports |
| **EEO-1 Component 1 Data** | https://www.eeoc.gov/data/eeo-1-data | Employer workforce demographic reports (companies 100+ employees) |

### SEC EDGAR

| Source | URL | Notes |
|--------|-----|-------|
| **EDGAR Full-Text Search** | https://efts.sec.gov/LATEST/search-index?q=%22workforce+reduction%22&dateRange=custom | Search 8-K filings for "workforce reduction", "layoff", "restructuring" |
| **EDGAR Company Search** | https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany | Look up specific company filings |
| **8-K Current Reports** | https://www.sec.gov/cgi-bin/browse-edgar?type=8-K&action=getcompany | 8-K filings often disclose layoffs under Item 2.05 (Costs of Exit/Disposal) or Item 8.01 (Other Events) |
| **Fed Reserve Working Paper** | https://www.federalreserve.gov/econres/feds/files/2024020pap.pdf | "Tracking Real Time Layoffs with SEC Filings" — methodology for extracting layoff data from 8-Ks |

### GAO (Government Accountability Office)

| Source | URL | Notes |
|--------|-----|-------|
| **Reports & Testimonies** | https://www.gao.gov/reports-testimonies | Search for workforce, technology displacement, AI impact reports |
| **Women in the Workforce** | https://www.gao.gov/assets/gao-23-106320.pdf | Example of workforce demographic analysis |
| **Federal Workforce Demographics** | https://www.gao.gov/assets/d24105924.pdf | Federal workforce data analysis using ACS |

### SBA (Small Business Administration)

| Source | URL | Notes |
|--------|-----|-------|
| **SBA Main** | https://www.sba.gov/ | Small business data, disaster loans, economic indicators |
| **Office of Advocacy** | https://advocacy.sba.gov/ | Small business statistics, research, and data |
| **Size Standards** | https://www.sba.gov/size-standards | Industry employment thresholds — context for small business layoffs |

### USITC (US International Trade Commission)

| Source | URL | Notes |
|--------|-----|-------|
| **Open Data Portal** | https://www.usitc.gov/data/index.htm | Trade data, industry analysis |
| **DataWeb (Trade & Tariff Data)** | https://dataweb.usitc.gov/ | US trade and tariff data lookup |
| **Research & Analysis** | https://www.usitc.gov/research_and_analysis.htm | Summary of reports, industry investigations |
| **Office of Economics** | https://www.usitc.gov/offices/econ | Economic impact modeling, trade policy analysis |
| **Section 232/301 Tariff Impact** | https://www.usitc.gov/publications/332/pub5405.pdf | Economic impact of tariffs on industries/workforce |
| **General Factfinding Investigations** | https://www.usitc.gov/keywords/general_factfinding_investigations | Trade-related industry investigations |

---

## States with Mini-WARN Acts (Expanded Requirements)

These states have their own layoff notice laws that go beyond the federal 60-day/100-employee thresholds:

| State | Key Difference |
|-------|---------------|
| California | 75+ employees (vs 100 federal). Must explain worker support plans (2026+) |
| Connecticut | State-specific notice requirements |
| Delaware | State WARN enacted |
| Hawaii | Extended notice + severance obligations |
| Illinois | State mini-WARN |
| Iowa | 30-day notice to DEED |
| Kansas | State-specific requirements |
| Maine | 90-day notice + severance obligations |
| Massachusetts | State mini-WARN |
| Michigan | State mini-WARN |
| Minnesota | 50+ employees (vs 100 federal) |
| New Hampshire | Must report layoffs of 25+ individuals |
| New Jersey | 90-day notice, 50+ employees |
| New York | 90-day notice, 50+ employees |
| Oregon | State mini-WARN |
| Rhode Island | State mini-WARN |
| South Carolina | State-specific requirements |
| Tennessee | Covers 50-99 employees (fills federal gap) |
| Vermont | Notice of Potential Layoffs Act (NPLA) + Mass Separation rule |
| Wisconsin | State mini-WARN |

---

## Key References

- Federal WARN Act regulation: [20 CFR Part 639](https://www.ecfr.gov/current/title-20/chapter-V/part-639)
- State WARN comparison: [Employment Law Handbook](https://www.employmentlawhandbook.com/layoff-warn-notices-by-state/)
- State Chambers summary: [statechambers.org/state-warn-acts](https://www.statechambers.org/state-warn-acts)
- Sugar Law Center resources: [sugarlaw.org/warn-act-legislation](https://www.sugarlaw.org/warn-act-legislation-copy)
