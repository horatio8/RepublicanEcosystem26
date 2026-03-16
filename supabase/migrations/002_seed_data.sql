-- Seed data: major conservative organizations and relationships

-- ══════════════════════════════════════════════════════════════════
-- EXISTING ORGANIZATIONS (think tanks, nonprofits, media, etc.)
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('Republican National Committee', 'National Party Committee', 'The main organizational body of the Republican Party', 'https://www.gop.com', 'DC', 'Washington', 300000000, 'C00003418', true),
  ('Heritage Foundation', 'Think Tank', 'Conservative think tank and policy research organization. Publishes the annual Mandate for Leadership and created Project 2025.', 'https://www.heritage.org', 'DC', 'Washington', 86000000, NULL, true),
  ('American Enterprise Institute', 'Think Tank', 'Center-right think tank focused on government, economics, and foreign policy', 'https://www.aei.org', 'DC', 'Washington', 55000000, NULL, true),
  ('Federalist Society', '501(c)(3) Nonprofit', 'Organization of conservatives and libertarians focused on reforming the legal system. Major influence on judicial nominations.', 'https://fedsoc.org', 'DC', 'Washington', 25000000, NULL, true),
  ('Americans for Prosperity', '501(c)(4) Nonprofit', 'Koch-network advocacy group focused on free-market policies', 'https://americansforprosperity.org', 'VA', 'Arlington', 60000000, NULL, true),
  ('Club for Growth', 'PAC', 'Fiscally conservative PAC that supports pro-growth candidates', 'https://www.clubforgrowth.org', 'DC', 'Washington', 30000000, 'C00432260', true),
  ('National Rifle Association', '501(c)(4) Nonprofit', 'Gun rights advocacy organization', 'https://www.nra.org', 'VA', 'Fairfax', 250000000, NULL, true),
  ('Turning Point USA', '501(c)(3) Nonprofit', 'Conservative youth organization focused on college campuses', 'https://www.tpusa.com', 'AZ', 'Phoenix', 80000000, NULL, true),
  ('Susan B. Anthony Pro-Life America', 'PAC', 'Anti-abortion political organization supporting pro-life candidates', 'https://sbaprolife.org', 'VA', 'Arlington', 18000000, 'C00332296', true),
  ('Judicial Watch', '501(c)(3) Nonprofit', 'Conservative legal watchdog organization using FOIA requests', 'https://www.judicialwatch.org', 'DC', 'Washington', 50000000, NULL, true),
  ('Faith & Freedom Coalition', '501(c)(4) Nonprofit', 'Christian conservative advocacy organization founded by Ralph Reed', 'https://www.ffcoalition.com', 'GA', 'Duluth', 15000000, NULL, true),
  ('American Conservative Union', '501(c)(4) Nonprofit', 'Hosts CPAC (Conservative Political Action Conference)', 'https://conservative.org', 'VA', 'Alexandria', 20000000, NULL, true),
  ('The Daily Wire', 'Media Organization', 'Conservative media company founded by Ben Shapiro', 'https://www.dailywire.com', 'TN', 'Nashville', 100000000, NULL, true),
  ('Fox News', 'Media Organization', 'Conservative cable news network (Fox Corporation subsidiary)', 'https://www.foxnews.com', 'NY', 'New York', 3000000000, NULL, true),
  ('Hillsdale College', '501(c)(3) Nonprofit', 'Conservative liberal arts college; influential in right-wing education policy', 'https://www.hillsdale.edu', 'MI', 'Hillsdale', 120000000, NULL, true),
  ('Leadership Institute', '501(c)(3) Nonprofit', 'Conservative training organization for political activists and campaign staff', 'https://www.leadershipinstitute.org', 'VA', 'Arlington', 17000000, NULL, true),
  ('Koch Industries', 'Business / Corporation', 'Conglomerate; Koch network is major funder of conservative causes', 'https://www.kochind.com', 'KS', 'Wichita', 125000000000, NULL, true),
  ('Alliance Defending Freedom', '501(c)(3) Nonprofit', 'Conservative Christian legal advocacy organization', 'https://adflegal.org', 'AZ', 'Scottsdale', 90000000, NULL, true),
  ('Cato Institute', 'Think Tank', 'Libertarian think tank focused on individual liberty and free markets', 'https://www.cato.org', 'DC', 'Washington', 40000000, NULL, true),
  ('Manhattan Institute', 'Think Tank', 'Conservative think tank focused on urban policy and economic growth', 'https://www.manhattan-institute.org', 'NY', 'New York', 15000000, NULL, true),
  ('PragerU', 'Media Organization', 'Conservative media nonprofit producing short educational videos', 'https://www.prageru.com', 'CA', 'Los Angeles', 50000000, NULL, true),
  ('Family Research Council', '501(c)(4) Nonprofit', 'Conservative Christian advocacy group focused on family values', 'https://www.frc.org', 'DC', 'Washington', 18000000, NULL, true),
  ('Competitive Enterprise Institute', 'Think Tank', 'Libertarian think tank focused on deregulation and free enterprise', 'https://cei.org', 'DC', 'Washington', 8000000, NULL, true),
  ('Pacific Legal Foundation', '501(c)(3) Nonprofit', 'Public interest law firm advancing property rights and limited government', 'https://pacificlegal.org', 'CA', 'Sacramento', 25000000, NULL, true),
  ('Young Americas Foundation', '501(c)(3) Nonprofit', 'Conservative youth organization; operates Reagan Ranch', 'https://www.yaf.org', 'VA', 'Reston', 22000000, NULL, true),
  ('America First Policy Institute', 'Think Tank', 'Think tank aligned with the Trump movement', 'https://americafirstpolicy.com', 'DC', 'Washington', 25000000, NULL, true),
  ('Claremont Institute', 'Think Tank', 'Conservative think tank focused on restoring founding principles', 'https://www.claremont.org', 'CA', 'Claremont', 12000000, NULL, true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- NATIONAL PARTY COMMITTEES
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('National Republican Congressional Committee', 'National Party Committee', 'Republican Hill committee working to elect Republicans to the U.S. House of Representatives', 'https://www.nrcc.org', 'DC', 'Washington', 250000000, 'C00075820', true),
  ('National Republican Senatorial Committee', 'National Party Committee', 'Republican Hill committee working to elect Republicans to the U.S. Senate', 'https://www.nrsc.org', 'DC', 'Washington', 230000000, 'C00027466', true),
  ('Republican Governors Association', '527 Organization', 'Organization of Republican governors that funds gubernatorial campaigns nationwide', 'https://www.rga.org', 'DC', 'Washington', 65000000, NULL, true),
  ('Republican State Leadership Committee', '527 Organization', 'Largest Republican organization focused on electing Republicans to state-level offices', NULL, 'DC', 'Washington', 45000000, NULL, true),
  ('Republican Attorneys General Association', '527 Organization', 'Political advocacy group focused on electing Republican state attorneys general', 'https://republicanags.com', 'DC', 'Washington', 30000000, NULL, true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- TRUMP-AFFILIATED PACs AND LEADERSHIP PACs
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('Save America PAC', 'Leadership PAC', 'Trump-controlled leadership PAC and primary fundraising vehicle since 2020', NULL, 'FL', 'West Palm Beach', 100000000, 'C00762591', true),
  ('Make America Great Again Inc.', 'Super PAC', 'Primary pro-Trump Super PAC raising $410M in the 2024 cycle, led by Taylor Budowich', NULL, 'FL', 'West Palm Beach', 410000000, 'C00825851', true),
  ('Make America Great Again PAC', 'PAC', 'Trump-affiliated PAC converted from his 2020 presidential campaign committee', NULL, 'VA', 'Arlington', 18000000, 'C00580100', true),
  ('Preserve America PAC', 'Super PAC', 'Pro-Trump Super PAC primarily funded by Miriam Adelson with $100M+ in 2024', NULL, 'DC', 'Washington', 105000000, 'C00878801', true),
  ('America PAC', 'Super PAC', 'Elon Musk-founded Super PAC spending $239M to support Trump and Republicans in 2024', 'https://theamericapac.org', 'TX', 'Austin', 239000000, 'C00879510', true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- MAJOR REPUBLICAN SUPER PACs
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('Senate Leadership Fund', 'Super PAC', 'McConnell-aligned Super PAC supporting Republican Senate candidates, raising $299M in 2024', 'https://senateleadershipfund.org', 'DC', 'Washington', 299000000, 'C00571703', true),
  ('Congressional Leadership Fund', 'Super PAC', 'Super PAC supporting Republican House candidates, spending $217M in outside expenditures in 2024', NULL, 'DC', 'Washington', 217000000, 'C00504530', true),
  ('American Crossroads', 'Super PAC', 'Karl Rove-founded Super PAC raising $63M in 2024 to support Republican candidates', NULL, 'DC', 'Washington', 63000000, 'C00487363', true),
  ('Americans for Prosperity Action', 'Super PAC', 'Koch network Super PAC raising $182M in 2024, supporting conservative congressional candidates', NULL, 'VA', 'Arlington', 182000000, 'C00687103', true),
  ('Club for Growth Action', 'Super PAC', 'Fiscally conservative Super PAC raising $89M in 2024 for independent expenditures', NULL, 'DC', 'Washington', 89000000, 'C00487470', true),
  ('Restoration PAC', 'Super PAC', 'Richard Uihlein-funded Super PAC raising $82M in 2024 to support conservative candidates', NULL, 'IL', 'Downers Grove', 82000000, 'C00571588', true),
  ('Sentinel Action Fund', 'Super PAC', 'Conservative Super PAC with year-round ground game for voter turnout, originally affiliated with Heritage Action', 'https://sentinelactionfund.com', 'DC', 'Washington', 18000000, 'C00811166', true),
  ('Keystone Renewal PAC', 'Super PAC', 'Single-candidate Super PAC raising $62M in 2024 to support Dave McCormick for U.S. Senate in Pennsylvania', NULL, 'PA', NULL, 62000000, NULL, true),
  ('Great America PAC', 'Super PAC', 'Pro-Trump hybrid PAC founded in 2016, led by Ed Rollins, that spent $26M supporting Trump', NULL, 'DC', 'Washington', 26000000, 'C00608489', true),
  ('Republican Jewish Coalition Victory Fund', 'Super PAC', 'Super PAC raising $17M in 2024 to support Republican candidates and pro-Israel policy', NULL, 'DC', 'Washington', 17000000, NULL, true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- TRADITIONAL PACs (CONNECTED AND NON-CONNECTED)
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('NRA Political Victory Fund', 'PAC', 'NRA-affiliated PAC that grades candidates on Second Amendment positions and makes independent expenditures', 'https://www.nrapvf.org', 'VA', 'Fairfax', 23000000, 'C00053553', true),
  ('Republican Jewish Coalition PAC', 'PAC', 'PAC supporting Republican candidates aligned with pro-Israel policy and Jewish community interests', 'https://www.rjchq.org', 'DC', 'Washington', 3500000, 'C00345132', true),
  ('Republican Main Street Partnership PAC', 'PAC', 'PAC supporting moderate Republican candidates in competitive districts', 'https://www.republicanmainstreet.org', 'DC', 'Washington', 1600000, 'C00165159', true),
  ('GOPAC Election Fund', 'PAC', 'Republican training organization PAC supporting state and federal candidates since 1978', 'https://www.gopac.org', 'DC', 'Washington', 2000000, 'C00559740', true),
  ('Turning Point PAC', 'PAC', 'PAC associated with Turning Point USA, raising $7M in 2024 for conservative youth-oriented candidates', NULL, 'AZ', 'Phoenix', 7000000, 'C00814152', true),
  ('Winning for Women PAC', 'PAC', 'PAC dedicated to electing conservative women with 87% primary win rate for backed candidates', 'https://winningforwomen.com', 'DC', 'Washington', 5000000, NULL, true),
  ('Maggie''s List', 'PAC', 'PAC dedicated to electing conservative women to Congress, focused on fiscal responsibility and limited government', 'https://maggieslist.org', 'DC', 'Washington', 1500000, NULL, true),
  ('VIEW PAC', 'PAC', 'Value in Electing Women PAC dedicated to electing Republican women to federal office', 'https://www.viewpac.org', 'DC', 'Washington', 1000000, NULL, true),
  ('Susan B. Anthony List Action', 'Super PAC', 'Super PAC arm of Susan B. Anthony Pro-Life America spending on pro-life candidate races', NULL, 'VA', 'Arlington', 40000000, 'C00688945', true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- JOINT FUNDRAISING COMMITTEES
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('Trump Save America Joint Fundraising Committee', 'Joint Fundraising Committee', 'JFC splitting proceeds between Trump for President 2024 and Save America PAC, raising $245M in 2024', NULL, 'VA', 'Arlington', 245000000, 'C00770941', true),
  ('Trump 47 Committee', 'Joint Fundraising Committee', 'JFC accepting up to $814,600 per donor for Trump 2024 campaign and Republican committees', NULL, 'VA', 'Arlington', 200000000, 'C00867937', true),
  ('Trump National Committee JFC', 'Joint Fundraising Committee', 'Joint fundraising committee coordinating Trump campaign fundraising with national party committees', NULL, 'VA', 'Arlington', 150000000, 'C00873893', true),
  ('Protect the House 2024', 'Joint Fundraising Committee', 'JFC associated with House Republican leadership fundraising for two dozen swing-district candidates', NULL, 'DC', 'Washington', 50000000, NULL, true),
  ('Grow the Majority', 'Joint Fundraising Committee', 'Speaker Johnson-affiliated JFC fundraising for three dozen Republican House candidates nationwide', NULL, 'DC', 'Washington', 40000000, NULL, true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- DARK MONEY / 501(c)(4) POLITICAL GROUPS
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('One Nation', '501(c)(4) Nonprofit', 'Karl Rove-affiliated dark money group working with Senate Leadership Fund, spending nearly $200M in 2020', NULL, 'DC', 'Washington', 100000000, NULL, true),
  ('American Action Network', '501(c)(4) Nonprofit', 'House Republicans-aligned dark money group pouring $69M into 2024 elections', NULL, 'DC', 'Washington', 69000000, NULL, true),
  ('Securing American Greatness', '501(c)(4) Nonprofit', 'Trump-aligned dark money group run by Taylor Budowich that raised $275M in 2024 and funneled $62M to MAGA Inc.', NULL, 'FL', 'West Palm Beach', 275000000, NULL, true),
  ('Building America''s Future', '501(c)(4) Nonprofit', 'Elon Musk-funded dark money group supporting Trump and Republican candidates through targeted advertising', NULL, 'DC', 'Washington', 100000000, NULL, true),
  ('Heritage Action for America', '501(c)(4) Nonprofit', 'Political advocacy arm of the Heritage Foundation engaged in lobbying and grassroots mobilization', 'https://heritageaction.com', 'DC', 'Washington', 20000000, NULL, true)
ON CONFLICT DO NOTHING;

-- ══════════════════════════════════════════════════════════════════
-- FUNDRAISING PLATFORMS
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, fec_id, verified) VALUES
  ('WinRed', 'PAC', 'RNC-endorsed Republican online fundraising platform processing $1.7B in 2024, counterpart to Democratic ActBlue', 'https://winred.com', 'VA', 'Arlington', 1686000000, 'C00694323', true)
ON CONFLICT DO NOTHING;

-- Seed relationships (original)
INSERT INTO relationships (entity_a_name, entity_a_type, entity_b_name, entity_b_type, relationship_type, description, active) VALUES
  ('Koch Industries', 'organization', 'Americans for Prosperity', 'organization', 'Founding', 'Koch brothers founded AFP as their primary political advocacy arm', true),
  ('Koch Industries', 'organization', 'Cato Institute', 'organization', 'Founding', 'Charles Koch co-founded Cato Institute', true),
  ('Koch Industries', 'organization', 'Club for Growth', 'organization', 'Donation / Financial', 'Koch network donors contribute to Club for Growth', true),
  ('Koch Industries', 'organization', 'Competitive Enterprise Institute', 'organization', 'Donation / Financial', 'Koch network provides major funding', true),
  ('American Conservative Union', 'organization', 'Heritage Foundation', 'organization', 'Coalition Partner', 'Heritage is a key participant in CPAC events', true),
  ('American Conservative Union', 'organization', 'Turning Point USA', 'organization', 'Coalition Partner', 'TPUSA participates in CPAC events', true),
  ('Federalist Society', 'organization', 'Heritage Foundation', 'organization', 'Coalition Partner', 'Collaborate on judicial nominations and conservative legal strategy', true),
  ('Federalist Society', 'organization', 'Alliance Defending Freedom', 'organization', 'Coalition Partner', 'Share legal strategy on religious liberty cases', true),
  ('Federalist Society', 'organization', 'Pacific Legal Foundation', 'organization', 'Coalition Partner', 'Coordinate on constitutional litigation', true),
  ('Senate Leadership Fund', 'organization', 'Republican National Committee', 'organization', 'Coalition Partner', 'Coordinates spending with RNC on Senate races', true),
  ('Congressional Leadership Fund', 'organization', 'Republican National Committee', 'organization', 'Coalition Partner', 'Coordinates spending with RNC on House races', true),
  ('Leadership Institute', 'organization', 'Turning Point USA', 'organization', 'Coalition Partner', 'Both focus on training young conservative activists', true),
  ('Leadership Institute', 'organization', 'Young Americas Foundation', 'organization', 'Coalition Partner', 'Coordinate on campus conservative programs', true),
  ('Heritage Foundation', 'organization', 'America First Policy Institute', 'organization', 'Coalition Partner', 'Both develop policy proposals for Republican administrations', true),
  ('Heritage Foundation', 'organization', 'Claremont Institute', 'organization', 'Coalition Partner', 'Share intellectual resources on constitutional originalism', true),
  ('Family Research Council', 'organization', 'Faith & Freedom Coalition', 'organization', 'Coalition Partner', 'Coordinate on Christian conservative political strategy', true),
  ('Family Research Council', 'organization', 'Susan B. Anthony Pro-Life America', 'organization', 'Coalition Partner', 'Coordinate on pro-life advocacy and legislation', true),
  ('Fox News', 'organization', 'The Daily Wire', 'organization', 'Coalition Partner', 'Dominant conservative media outlets with overlapping audiences', true),
  ('Fox News', 'organization', 'PragerU', 'organization', 'Coalition Partner', 'Cross-promote conservative media content', true),
  ('Save America PAC', 'organization', 'Republican National Committee', 'organization', 'Coalition Partner', 'Trump-aligned PAC coordinating with RNC', true),
  ('Hillsdale College', 'organization', 'Claremont Institute', 'organization', 'Advisory', 'Share faculty and intellectual leadership on founding principles', true)
ON CONFLICT DO NOTHING;

-- Additional relationships for PACs, Super PACs, and political committees
INSERT INTO relationships (entity_a_name, entity_a_type, entity_b_name, entity_b_type, relationship_type, description, active) VALUES
  -- Trump ecosystem
  ('Save America PAC', 'organization', 'Make America Great Again Inc.', 'organization', 'Donation / Financial', 'Save America transferred $60M+ to MAGA Inc. in 2022', true),
  ('Securing American Greatness', 'organization', 'Make America Great Again Inc.', 'organization', 'Donation / Financial', 'Dark money group funneled $62M to MAGA Inc. in Oct 2024', true),
  ('Trump Save America Joint Fundraising Committee', 'organization', 'Save America PAC', 'organization', 'Joint Fundraising', 'JFC splits proceeds between Trump campaign and Save America', true),
  ('Trump Save America Joint Fundraising Committee', 'organization', 'Make America Great Again PAC', 'organization', 'Joint Fundraising', 'JFC raises for Trump-affiliated committees', true),
  ('Trump 47 Committee', 'organization', 'Republican National Committee', 'organization', 'Joint Fundraising', 'JFC coordinates Trump campaign fundraising with RNC', true),
  ('Trump National Committee JFC', 'organization', 'Republican National Committee', 'organization', 'Joint Fundraising', 'JFC coordinates Trump and national party fundraising', true),
  ('America PAC', 'organization', 'Turning Point PAC', 'organization', 'Coalition Partner', 'Coordinated ground game canvassing efforts for Trump in 2024', true),

  -- Karl Rove / McConnell network
  ('American Crossroads', 'organization', 'Senate Leadership Fund', 'organization', 'Shared Leadership', 'Both led by Steven J. Law under the McConnell-aligned network', true),
  ('One Nation', 'organization', 'Senate Leadership Fund', 'organization', 'Donation / Financial', 'One Nation steered $63M+ to Senate Leadership Fund in 2024', true),
  ('American Crossroads', 'organization', 'One Nation', 'organization', 'Shared Leadership', 'Same leadership team; One Nation is dark money counterpart to American Crossroads', true),
  ('American Action Network', 'organization', 'Congressional Leadership Fund', 'organization', 'Subsidiary / Parent', 'AAN is the dark money counterpart supporting House Republican super PAC', true),

  -- Koch network
  ('Americans for Prosperity', 'organization', 'Americans for Prosperity Action', 'organization', 'Subsidiary / Parent', 'AFP Action is the super PAC arm of Americans for Prosperity', true),
  ('Koch Industries', 'organization', 'Americans for Prosperity Action', 'organization', 'Donation / Financial', 'Koch network is primary funder of AFP Action', true),

  -- Heritage ecosystem
  ('Heritage Foundation', 'organization', 'Heritage Action for America', 'organization', 'Subsidiary / Parent', 'Heritage Action is the political advocacy arm of Heritage Foundation', true),
  ('Heritage Action for America', 'organization', 'Sentinel Action Fund', 'organization', 'Founding', 'Sentinel Action Fund originally founded as affiliate of Heritage Action in 2022', true),

  -- Party committee coordination
  ('National Republican Congressional Committee', 'organization', 'Protect the House 2024', 'organization', 'Joint Fundraising', 'NRCC is a beneficiary of Protect the House JFC', true),
  ('National Republican Senatorial Committee', 'organization', 'Republican National Committee', 'organization', 'Coalition Partner', 'Coordinates Senate campaign strategy with RNC', true),
  ('National Republican Congressional Committee', 'organization', 'Republican National Committee', 'organization', 'Coalition Partner', 'Coordinates House campaign strategy with RNC', true),
  ('WinRed', 'organization', 'Republican National Committee', 'organization', 'Vendor / Service Provider', 'WinRed is the RNC-endorsed online fundraising platform processing $1.7B in 2024', true),

  -- Issue PAC connections
  ('NRA Political Victory Fund', 'organization', 'National Rifle Association', 'organization', 'Subsidiary / Parent', 'NRA-PVF is the political arm of the National Rifle Association', true),
  ('Club for Growth', 'organization', 'Club for Growth Action', 'organization', 'Subsidiary / Parent', 'Club for Growth Action is the Super PAC arm of Club for Growth', true),
  ('Susan B. Anthony Pro-Life America', 'organization', 'Susan B. Anthony List Action', 'organization', 'Subsidiary / Parent', 'SBA List Action is the Super PAC arm spending on pro-life races', true),
  ('Republican Jewish Coalition PAC', 'organization', 'Republican Jewish Coalition Victory Fund', 'organization', 'Subsidiary / Parent', 'RJC Victory Fund is the Super PAC arm of the Republican Jewish Coalition', true),

  -- State-level coordination
  ('Sentinel Action Fund', 'organization', 'Keystone Renewal PAC', 'organization', 'Coalition Partner', 'Joint $16M mail-in ballot initiative in Pennsylvania for 2024', true),
  ('Republican State Leadership Committee', 'organization', 'Keystone Renewal PAC', 'organization', 'Coalition Partner', 'Joint investment in Pennsylvania Republican voter turnout', true),
  ('Building America''s Future', 'organization', 'Senate Leadership Fund', 'organization', 'Donation / Financial', 'SLF gave $1.5M to BAF-affiliated Future Coalition PAC in 2024', true)
ON CONFLICT DO NOTHING;
