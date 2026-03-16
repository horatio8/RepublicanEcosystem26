-- Add unique constraint on organization name to support upsert operations
ALTER TABLE organizations ADD CONSTRAINT organizations_name_unique UNIQUE (name);

-- Expanded seed data: 150+ conservative/Republican organizations
-- Categories use the org_category enum defined in 001_create_tables.sql:
--   'PAC', 'Super PAC', '501(c)(3) Nonprofit', '501(c)(4) Nonprofit',
--   '527 Organization', 'Think Tank', 'Media Organization',
--   'Consulting Firm', 'Law Firm', 'Lobbying Firm', 'Trade Association',
--   'Campaign Committee', 'State Party', 'National Party Committee',
--   'Leadership PAC', 'Joint Fundraising Committee',
--   'Business / Corporation', 'Religious Organization',
--   'Grassroots Organization', 'Digital / Tech Firm', 'Polling Firm', 'Other'

-- ══════════════════════════════════════════════════════════════════
-- NATIONAL THINK TANKS
-- ══════════════════════════════════════════════════════════════════

INSERT INTO organizations (name, category, description, website, state, city, annual_revenue, ein, verified) VALUES

-- Major national think tanks
('Hoover Institution', 'Think Tank', 'Conservative public policy think tank at Stanford University focused on politics, economics, and international affairs.', 'https://www.hoover.org', 'CA', 'Stanford', 70000000, '94-1156365', true),
('Hudson Institute', 'Think Tank', 'Conservative think tank promoting American leadership, global engagement, and free-market economics.', 'https://www.hudson.org', 'DC', 'Washington', 25000000, '13-1998445', true),
('Discovery Institute', 'Think Tank', 'Conservative think tank known for promoting intelligent design and technology policy.', 'https://www.discovery.org', 'WA', 'Seattle', 8000000, '91-1684757', true),
('Heartland Institute', 'Think Tank', 'Conservative and libertarian think tank focused on climate skepticism, free-market environmentalism, and deregulation.', 'https://www.heartland.org', 'IL', 'Arlington Heights', 6000000, '36-3309812', true),
('Independent Institute', 'Think Tank', 'Libertarian think tank promoting individual liberty, limited government, and free markets.', 'https://www.independent.org', 'CA', 'Oakland', 5000000, '94-3055028', true),
('Reason Foundation', 'Think Tank', 'Libertarian think tank promoting free markets, individual liberty, and the rule of law.', 'https://reason.org', 'CA', 'Los Angeles', 15000000, '95-3298913', true),
('American Action Forum', 'Think Tank', 'Center-right policy institute focused on economic growth, tax reform, and regulatory policy.', 'https://www.americanactionforum.org', 'DC', 'Washington', 5000000, '27-2876655', true),
('National Center for Policy Analysis', 'Think Tank', 'Conservative think tank that promoted free-market solutions to health care, tax, and retirement policy (closed 2017, legacy org).', NULL, 'TX', 'Dallas', 0, '75-1928928', false),
('Acton Institute', 'Think Tank', 'Conservative think tank promoting a free and virtuous society through integration of religious principles and free-market economics.', 'https://www.acton.org', 'MI', 'Grand Rapids', 10000000, '38-2946788', true),
('Ethics and Public Policy Center', 'Think Tank', 'Conservative think tank applying Judeo-Christian moral tradition to public policy debates.', 'https://eppc.org', 'DC', 'Washington', 6000000, '52-1140043', true),
('Mercatus Center', 'Think Tank', 'Free-market research center at George Mason University focused on market-oriented regulatory policy.', 'https://www.mercatus.org', 'VA', 'Arlington', 20000000, '52-1647547', true),
('R Street Institute', 'Think Tank', 'Center-right think tank promoting free markets and limited government through pragmatic policy solutions.', 'https://www.rstreet.org', 'DC', 'Washington', 10000000, '46-1688775', true),
('National Bureau of Asian Research', 'Think Tank', 'Nonpartisan research institution focusing on Asia-Pacific policy with a center-right orientation on security matters.', 'https://www.nbr.org', 'WA', 'Seattle', 12000000, '91-1430657', true),
('Foundation for Defense of Democracies', 'Think Tank', 'Hawkish think tank focused on foreign policy, national security, and counterterrorism.', 'https://www.fdd.org', 'DC', 'Washington', 18000000, '31-1716930', true),
('Center for Strategic and International Studies', 'Think Tank', 'Bipartisan think tank with a center-right foreign policy orientation focused on defense and international security.', 'https://www.csis.org', 'DC', 'Washington', 55000000, '52-0848099', true),
('Center for Immigration Studies', 'Think Tank', 'Anti-immigration think tank favoring reduced immigration levels and stricter enforcement.', 'https://cis.org', 'DC', 'Washington', 6000000, '52-1549711', true),
('Niskanen Center', 'Think Tank', 'Center-right think tank promoting a moderate libertarian policy agenda and political moderation.', 'https://www.niskanencenter.org', 'DC', 'Washington', 4000000, '81-1218389', true),
('Institute for Energy Research', 'Think Tank', 'Free-market energy think tank opposing renewable energy mandates and supporting fossil fuels.', 'https://www.instituteforenergyresearch.org', 'DC', 'Washington', 3000000, '52-2053910', true),
('Tax Foundation', 'Think Tank', 'Independent tax policy think tank promoting economically sound tax policy with a free-market orientation.', 'https://taxfoundation.org', 'DC', 'Washington', 7000000, '52-1703065', true),
('National Interest Foundation', 'Think Tank', 'Realist foreign policy think tank publishing The National Interest journal.', 'https://nationalinterest.org', 'DC', 'Washington', 3000000, NULL, true),
('Center for a New American Security', 'Think Tank', 'Bipartisan national security think tank with hawkish tendencies on defense policy.', 'https://www.cnas.org', 'DC', 'Washington', 15000000, '20-8984683', true),

-- ══════════════════════════════════════════════════════════════════
-- TRUMP-ALIGNED / MAGA ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('America First Legal Foundation', '501(c)(3) Nonprofit', 'Conservative legal organization founded by Stephen Miller that files lawsuits challenging progressive policies.', 'https://aflegal.org', 'DC', 'Washington', 44000000, '86-2190372', true),
('Center for Renewing America', '501(c)(3) Nonprofit', 'Trump-aligned policy organization led by former OMB Director Russ Vought focused on executive power.', 'https://centerforrenewingamerica.com', 'DC', 'Washington', 5000000, NULL, true),
('Conservative Partnership Institute', '501(c)(3) Nonprofit', 'Incubator for conservative organizations co-founded by Jim DeMint and linked to Mark Meadows.', 'https://www.conservativepartnership.org', 'DC', 'Washington', 45000000, '82-3439498', true),
('Advancing American Freedom', '501(c)(4) Nonprofit', 'Policy organization founded by former VP Mike Pence promoting conservative policies from the Trump-Pence era.', 'https://advancingamericanfreedom.com', 'DC', 'Washington', 5000000, NULL, true),
('Center for American Liberty', '501(c)(3) Nonprofit', 'Conservative legal organization founded by Harmeet Dhillon focusing on civil liberties and free speech cases.', 'https://libertycenter.org', 'CA', 'San Francisco', 5000000, NULL, true),

-- ══════════════════════════════════════════════════════════════════
-- LEGAL ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Liberty Counsel', '501(c)(3) Nonprofit', 'Christian conservative legal organization focusing on religious liberty and anti-LGBTQ litigation.', 'https://lc.org', 'FL', 'Orlando', 7000000, '59-3467516', true),
('American Center for Law and Justice', '501(c)(3) Nonprofit', 'Conservative legal organization founded by Jay Sekulow specializing in constitutional and religious freedom cases.', 'https://aclj.org', 'DC', 'Washington', 65000000, '54-1586817', true),
('Thomas More Law Center', '501(c)(3) Nonprofit', 'Conservative Christian legal organization defending religious freedom and traditional values.', 'https://www.thomasmore.org', 'MI', 'Ann Arbor', 8000000, '38-3395093', true),
('Thomas More Society', '501(c)(3) Nonprofit', 'Conservative Catholic legal organization focusing on pro-life, religious liberty, and election integrity cases.', 'https://thomasmoresociety.org', 'IL', 'Chicago', 12000000, '51-0192934', true),
('Becket Fund for Religious Liberty', '501(c)(3) Nonprofit', 'Nonpartisan legal organization protecting religious liberty for all faiths, frequently allied with conservative causes.', 'https://www.becketlaw.org', 'DC', 'Washington', 12000000, '52-2087842', true),
('Institute for Justice', '501(c)(3) Nonprofit', 'Libertarian public interest law firm litigating for economic liberty, property rights, and school choice.', 'https://ij.org', 'VA', 'Arlington', 40000000, '52-1744528', true),
('First Liberty Institute', '501(c)(3) Nonprofit', 'Conservative legal organization exclusively dedicated to defending religious liberty cases.', 'https://firstliberty.org', 'TX', 'Plano', 18000000, '75-2382753', true),
('Landmark Legal Foundation', '501(c)(3) Nonprofit', 'Conservative legal foundation focused on government accountability, led for years by Mark Levin.', 'https://landmarklegal.org', 'MO', 'Kansas City', 3000000, '43-1240962', true),
('Washington Legal Foundation', '501(c)(3) Nonprofit', 'Conservative legal foundation promoting free enterprise, individual rights, and limited government.', 'https://www.wlf.org', 'DC', 'Washington', 5000000, '52-1025808', true),
('Mountain States Legal Foundation', '501(c)(3) Nonprofit', 'Conservative public interest law firm specializing in property rights and natural resource issues.', 'https://mslegal.org', 'CO', 'Lakewood', 3000000, '84-0798141', true),
('Southeastern Legal Foundation', '501(c)(3) Nonprofit', 'Conservative legal organization advocating for limited government and individual freedom.', 'https://www.southeasternlegal.org', 'GA', 'Atlanta', 2000000, '58-1404957', true),
('New Civil Liberties Alliance', '501(c)(3) Nonprofit', 'Conservative legal organization challenging the administrative state and protecting civil liberties from bureaucratic overreach.', 'https://nclalegal.org', 'DC', 'Washington', 8000000, '82-4812933', true),
('Center for Individual Rights', '501(c)(3) Nonprofit', 'Conservative public interest law firm litigating against affirmative action and campus speech codes.', 'https://www.cir-usa.org', 'DC', 'Washington', 3000000, '52-1643809', true),
('Public Interest Legal Foundation', '501(c)(3) Nonprofit', 'Conservative legal organization focused on election integrity and voter roll maintenance.', 'https://publicinterestlegal.org', 'IN', 'Indianapolis', 3000000, '81-4894334', true),
('Honest Elections Project', '501(c)(4) Nonprofit', 'Conservative organization advocating for voter ID laws and election integrity measures, linked to Leonard Leo.', NULL, 'DC', 'Washington', 10000000, NULL, true),

-- ══════════════════════════════════════════════════════════════════
-- 501(c)(4) ADVOCACY ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Americans for Tax Reform', '501(c)(4) Nonprofit', 'Anti-tax advocacy organization founded by Grover Norquist known for the Taxpayer Protection Pledge.', 'https://www.atr.org', 'DC', 'Washington', 10000000, '52-1488528', true),
('FreedomWorks', '501(c)(4) Nonprofit', 'Libertarian advocacy organization that was instrumental in the Tea Party movement (largely wound down by 2024).', 'https://www.freedomworks.org', 'DC', 'Washington', 15000000, '52-1475583', true),
('Citizens United', '501(c)(4) Nonprofit', 'Conservative advocacy group known for the landmark Supreme Court case on campaign finance.', 'https://citizensunited.org', 'DC', 'Washington', 12000000, '52-1338235', true),
('Council for National Policy', '501(c)(3) Nonprofit', 'Secretive conservative networking organization connecting major right-wing donors, strategists, and leaders.', NULL, 'VA', 'Fairfax', 3000000, '52-1369478', true),
('Concerned Women for America', '501(c)(4) Nonprofit', 'Conservative Christian women''s advocacy organization focusing on family values and religious liberty.', 'https://concernedwomen.org', 'DC', 'Washington', 5000000, '52-1149668', true),
('Eagle Forum', '501(c)(4) Nonprofit', 'Conservative organization founded by Phyllis Schlafly focused on traditional values, national sovereignty, and opposing feminism.', 'https://eagleforum.org', 'MO', 'Alton', 2000000, '43-0960965', true),
('Convention of States Action', '501(c)(4) Nonprofit', 'Advocacy organization pushing for an Article V constitutional convention to limit federal power.', 'https://conventionofstates.com', 'TX', 'Houston', 10000000, '47-2598625', true),
('American Principles Project', '501(c)(4) Nonprofit', 'Conservative advocacy group opposing transgender rights policies and promoting traditional family values.', 'https://americanprinciplesproject.org', 'DC', 'Washington', 4000000, '45-4501417', true),
('Heritage Action for America', '501(c)(4) Nonprofit', 'Advocacy arm of the Heritage Foundation that lobbies Congress and scores legislative votes.', 'https://heritageaction.com', 'DC', 'Washington', 18000000, '27-4544007', true),
('American Legislative Exchange Council', '501(c)(3) Nonprofit', 'Organization connecting state legislators with corporations to draft model legislation promoting free markets and limited government.', 'https://alec.org', 'VA', 'Arlington', 11000000, '52-0140979', true),
('State Policy Network', '501(c)(3) Nonprofit', 'Umbrella network of 64 state-level conservative think tanks promoting free-market policies across all 50 states.', 'https://spn.org', 'VA', 'Arlington', 17000000, '86-0597494', true),

-- ══════════════════════════════════════════════════════════════════
-- RELIGIOUS / SOCIAL CONSERVATIVE ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Focus on the Family', 'Religious Organization', 'Conservative Christian ministry providing family advice, opposing LGBTQ rights, and promoting traditional values.', 'https://www.focusonthefamily.com', 'CO', 'Colorado Springs', 100000000, '23-7206800', true),
('American Family Association', '501(c)(3) Nonprofit', 'Conservative Christian organization opposing abortion, pornography, and LGBTQ rights through activism and media.', 'https://www.afa.net', 'MS', 'Tupelo', 20000000, '64-0607275', true),
('National Organization for Marriage', '501(c)(4) Nonprofit', 'Conservative organization opposing same-sex marriage and promoting traditional marriage definitions.', 'https://nationformarriage.org', 'DC', 'Washington', 2000000, '26-3537231', true),
('Billy Graham Evangelistic Association', 'Religious Organization', 'Major evangelical Christian organization with significant political influence in conservative circles.', 'https://billygraham.org', 'NC', 'Charlotte', 350000000, '41-0692230', true),
('Samaritan''s Purse', '501(c)(3) Nonprofit', 'Christian humanitarian organization led by Franklin Graham with significant conservative political involvement.', 'https://www.samaritanspurse.org', 'NC', 'Boone', 900000000, '58-1437002', true),
('Fellowship Foundation', '501(c)(3) Nonprofit', 'Secretive Christian organization hosting the National Prayer Breakfast and connecting conservative leaders in DC.', NULL, 'DC', 'Washington', 12000000, '52-6064946', true),
('Liberty University', '501(c)(3) Nonprofit', 'Conservative evangelical Christian university founded by Jerry Falwell that shapes right-wing political culture.', 'https://www.liberty.edu', 'VA', 'Lynchburg', 1100000000, '54-0953375', true),
('Council for Christian Colleges and Universities', '501(c)(3) Nonprofit', 'Association of Christian colleges promoting faith-based higher education and lobbying on religious liberty.', 'https://www.cccu.org', 'DC', 'Washington', 8000000, '54-1362119', true),

-- ══════════════════════════════════════════════════════════════════
-- PRO-LIFE / ANTI-ABORTION ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('National Right to Life Committee', '501(c)(4) Nonprofit', 'Oldest and largest anti-abortion organization in the United States.', 'https://www.nrlc.org', 'DC', 'Washington', 5000000, '52-0986195', true),
('Americans United for Life', '501(c)(3) Nonprofit', 'Conservative legal organization drafting model anti-abortion legislation for state legislatures.', 'https://aul.org', 'DC', 'Washington', 4000000, '36-2488822', true),
('March for Life Education and Defense Fund', '501(c)(3) Nonprofit', 'Organization that organizes the annual March for Life anti-abortion rally in Washington, DC.', 'https://marchforlife.org', 'DC', 'Washington', 3000000, '52-1400862', true),
('Live Action', '501(c)(3) Nonprofit', 'Anti-abortion media organization founded by Lila Rose producing undercover videos and social media content.', 'https://www.liveaction.org', 'VA', 'Arlington', 9000000, '26-0049908', true),
('Students for Life of America', '501(c)(3) Nonprofit', 'Anti-abortion youth organization building a pro-life generation on college campuses.', 'https://studentsforlife.org', 'VA', 'Fredericksburg', 8000000, '52-2336256', true),
('Human Coalition', '501(c)(3) Nonprofit', 'Anti-abortion organization operating pregnancy resource centers and digital outreach campaigns.', 'https://www.humancoalition.org', 'TX', 'Frisco', 20000000, '27-1384515', true),

-- ══════════════════════════════════════════════════════════════════
-- GUN RIGHTS ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Gun Owners of America', '501(c)(4) Nonprofit', 'No-compromise gun rights organization positioned to the right of the NRA on Second Amendment issues.', 'https://gunowners.org', 'VA', 'Springfield', 10000000, '52-1301493', true),
('National Shooting Sports Foundation', 'Trade Association', 'Firearms industry trade association promoting hunting, shooting sports, and opposing gun control.', 'https://www.nssf.org', 'CT', 'Newtown', 60000000, '06-0846898', true),
('Second Amendment Foundation', '501(c)(3) Nonprofit', 'Gun rights organization focused on legal action and education to protect the Second Amendment.', 'https://www.saf.org', 'WA', 'Bellevue', 12000000, '91-1103258', true),
('National Association for Gun Rights', '501(c)(4) Nonprofit', 'Hardline gun rights advocacy organization opposing all gun control measures.', 'https://www.nationalgunrights.org', 'CO', 'Loveland', 8000000, '20-8015753', true),
('Firearms Policy Coalition', '501(c)(4) Nonprofit', 'Gun rights organization focused on legal challenges to firearms regulations at all levels of government.', 'https://www.firearmspolicy.org', 'CA', 'Sacramento', 10000000, '81-2444018', true),

-- ══════════════════════════════════════════════════════════════════
-- IMMIGRATION RESTRICTION ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Federation for American Immigration Reform', '501(c)(3) Nonprofit', 'Leading anti-immigration organization advocating for reduced immigration levels and stricter enforcement.', 'https://www.fairus.org', 'DC', 'Washington', 13000000, '52-1136126', true),
('NumbersUSA', '501(c)(4) Nonprofit', 'Anti-immigration advocacy group seeking to reduce both legal and illegal immigration through grassroots action.', 'https://www.numbersusa.com', 'VA', 'Arlington', 12000000, '68-0386579', true),
('Immigration Reform Law Institute', '501(c)(3) Nonprofit', 'Legal arm of FAIR that litigates immigration cases and provides analysis of immigration law.', 'https://irli.org', 'DC', 'Washington', 2000000, '52-1539927', true),

-- ══════════════════════════════════════════════════════════════════
-- EDUCATION / PARENTAL RIGHTS ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Moms for Liberty', '501(c)(4) Nonprofit', 'Conservative parental rights organization opposing critical race theory and LGBTQ content in schools.', 'https://www.momsforliberty.org', 'FL', 'Melbourne', 2100000, '86-2568145', true),
('Parents Defending Education', '501(c)(3) Nonprofit', 'Conservative education watchdog opposing critical race theory and gender ideology in K-12 schools.', 'https://defendinged.org', 'VA', NULL, 3000000, NULL, true),
('National School Choice Week', '501(c)(3) Nonprofit', 'Organization promoting school choice options including charter schools, vouchers, and homeschooling.', 'https://schoolchoiceweek.com', 'DC', 'Washington', 4000000, NULL, true),
('American Federation for Children', '501(c)(4) Nonprofit', 'School choice advocacy organization promoting private school vouchers and education savings accounts.', 'https://www.federationforchildren.org', 'DC', 'Washington', 10000000, '27-1560188', true),
('EdChoice', '501(c)(3) Nonprofit', 'School choice research and advocacy organization promoting education freedom and parental choice.', 'https://www.edchoice.org', 'IN', 'Indianapolis', 8000000, '35-1982917', true),

-- ══════════════════════════════════════════════════════════════════
-- DONOR / FUNDING ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('DonorsTrust', '501(c)(3) Nonprofit', 'Donor-advised fund serving as the primary vehicle for anonymous conservative philanthropy in the US.', 'https://www.donorstrust.org', 'VA', 'Alexandria', 134000000, '52-2166327', true),
('Donors Capital Fund', '501(c)(3) Nonprofit', 'Sister organization to DonorsTrust handling large anonymous conservative donations over $1 million.', NULL, 'VA', 'Alexandria', 50000000, '52-2297099', true),
('Lynde and Harry Bradley Foundation', '501(c)(3) Nonprofit', 'One of the largest and most influential funders of the conservative movement with nearly $1 billion in assets.', 'https://www.bradleyfdn.org', 'WI', 'Milwaukee', 50000000, '39-6037928', true),
('Bradley Impact Fund', '501(c)(3) Nonprofit', 'Community foundation for conservative donors managed by the Bradley Foundation.', 'https://www.bradleyimpactfund.org', 'WI', 'Milwaukee', 30000000, NULL, true),
('Charles Koch Foundation', '501(c)(3) Nonprofit', 'Major philanthropic foundation funding free-market research, education, and criminal justice reform.', 'https://www.charleskochfoundation.org', 'VA', 'Arlington', 250000000, '48-0918408', true),
('Philanthropy Roundtable', '501(c)(3) Nonprofit', 'Association of conservative philanthropists coordinating right-of-center charitable giving.', 'https://www.philanthropyroundtable.org', 'DC', 'Washington', 12000000, '52-1268030', true),
('Sarah Scaife Foundation', '501(c)(3) Nonprofit', 'Major conservative foundation funding think tanks, media, and policy organizations.', NULL, 'PA', 'Pittsburgh', 30000000, '25-6022032', true),
('Searle Freedom Trust', '501(c)(3) Nonprofit', 'Private foundation providing grants to conservative and free-market policy organizations.', NULL, 'IL', 'Chicago', 15000000, '36-7015261', true),
('Marble Freedom Trust', '501(c)(4) Nonprofit', 'Dark money organization run by Leonard Leo that received a $1.6 billion donation to fund conservative causes.', NULL, 'DC', 'Washington', 1600000000, NULL, true),

-- ══════════════════════════════════════════════════════════════════
-- MEDIA ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Newsmax Media', 'Media Organization', 'Conservative cable news and digital media company founded by Christopher Ruddy.', 'https://www.newsmax.com', 'FL', 'West Palm Beach', 200000000, NULL, true),
('One America News Network', 'Media Organization', 'Far-right cable news network founded by Robert Herring Sr.', 'https://www.oann.com', 'CA', 'San Diego', 30000000, NULL, true),
('Salem Media Group', 'Media Organization', 'Conservative Christian media company operating radio stations, websites, and book publishing.', 'https://salemmedia.com', 'TX', 'Irving', 260000000, NULL, true),
('Sinclair Broadcast Group', 'Media Organization', 'Largest television station operator in the US with well-documented conservative editorial mandates.', 'https://sbgi.net', 'MD', 'Hunt Valley', 3400000000, NULL, true),
('Blaze Media', 'Media Organization', 'Conservative media company founded by Glenn Beck and merged with CRTV.', 'https://www.theblaze.com', 'TX', 'Irving', 40000000, NULL, true),
('Epoch Times', 'Media Organization', 'Far-right media outlet affiliated with the Falun Gong movement that promotes conservative and conspiratorial content.', 'https://www.theepochtimes.com', 'NY', 'New York', 100000000, NULL, true),
('Washington Free Beacon', 'Media Organization', 'Conservative online news outlet focused on investigative journalism from a right-of-center perspective.', 'https://freebeacon.com', 'DC', 'Washington', 5000000, NULL, true),
('Washington Examiner', 'Media Organization', 'Conservative news outlet owned by Philip Anschutz covering politics and policy.', 'https://www.washingtonexaminer.com', 'DC', 'Washington', 20000000, NULL, true),
('Breitbart News', 'Media Organization', 'Far-right media outlet co-founded by Andrew Breitbart that became influential in the Trump movement.', 'https://www.breitbart.com', 'CA', 'Los Angeles', 20000000, NULL, true),
('The Federalist', 'Media Organization', 'Conservative online magazine covering politics, policy, and culture.', 'https://thefederalist.com', 'DC', 'Washington', 5000000, NULL, true),
('National Review', 'Media Organization', 'Conservative magazine founded by William F. Buckley Jr. in 1955, considered the flagship of traditional conservatism.', 'https://www.nationalreview.com', 'NY', 'New York', 20000000, '13-1756591', true),
('American Spectator', 'Media Organization', 'Conservative monthly magazine covering politics and culture since 1924.', 'https://spectator.org', 'VA', 'Arlington', 3000000, NULL, true),
('Capital Research Center', '501(c)(3) Nonprofit', 'Conservative research organization investigating nonprofits, unions, and government agencies.', 'https://capitalresearch.org', 'DC', 'Washington', 4000000, '52-1289734', true),

-- ══════════════════════════════════════════════════════════════════
-- STATE-LEVEL THINK TANKS (SPN Affiliates)
-- ══════════════════════════════════════════════════════════════════

('Texas Public Policy Foundation', 'Think Tank', 'Major conservative state-level think tank promoting free markets, limited government, and individual liberty in Texas.', 'https://www.texaspolicy.com', 'TX', 'Austin', 15000000, '74-2524057', true),
('Goldwater Institute', 'Think Tank', 'Conservative Arizona think tank and litigation center promoting school choice, free speech, and limited government.', 'https://www.goldwaterinstitute.org', 'AZ', 'Phoenix', 12000000, '86-0597661', true),
('Mackinac Center for Public Policy', 'Think Tank', 'Michigan-based free-market think tank focusing on labor policy, education, and economic freedom.', 'https://www.mackinac.org', 'MI', 'Midland', 8000000, '38-2795760', true),
('Pacific Research Institute', 'Think Tank', 'California-based free-market think tank focusing on education, health care, and technology policy.', 'https://www.pacificresearch.org', 'CA', 'San Francisco', 5000000, '94-2842077', true),
('Independence Institute', 'Think Tank', 'Colorado-based libertarian think tank promoting school choice, gun rights, and fiscal policy reform.', 'https://i2i.org', 'CO', 'Denver', 3000000, '84-1066773', true),
('Georgia Public Policy Foundation', 'Think Tank', 'State-level conservative think tank promoting free enterprise and limited government in Georgia.', 'https://www.georgiapolicy.org', 'GA', 'Atlanta', 1500000, '58-1932105', true),
('James Madison Institute', 'Think Tank', 'Florida-based free-market think tank focused on education, criminal justice, and economic policy.', 'https://www.jamesmadison.org', 'FL', 'Tallahassee', 3000000, '59-2646397', true),
('John Locke Foundation', 'Think Tank', 'North Carolina-based conservative think tank promoting limited government and free markets.', 'https://www.johnlocke.org', 'NC', 'Raleigh', 5000000, '56-1757423', true),
('Beacon Center of Tennessee', 'Think Tank', 'Tennessee-based free-market think tank promoting school choice, criminal justice reform, and fiscal responsibility.', 'https://www.beacontn.org', 'TN', 'Nashville', 3000000, '62-1606046', true),
('Buckeye Institute', 'Think Tank', 'Ohio-based free-market think tank promoting individual liberty, economic freedom, and limited government.', 'https://www.buckeyeinstitute.org', 'OH', 'Columbus', 4000000, '31-1314937', true),
('Pioneer Institute', 'Think Tank', 'Massachusetts-based free-market think tank promoting education reform, health care, and transportation policy.', 'https://pioneerinstitute.org', 'MA', 'Boston', 3000000, '04-3073498', true),
('Pelican Institute', 'Think Tank', 'Louisiana-based free-market think tank promoting education freedom and criminal justice reform.', 'https://pelicaninstitute.org', 'LA', 'New Orleans', 2000000, '72-1270544', true),
('Nevada Policy Research Institute', 'Think Tank', 'Nevada-based free-market think tank promoting school choice and limited government.', 'https://npri.org', 'NV', 'Las Vegas', 1500000, '88-0337925', true),
('Josiah Bartlett Center for Public Policy', 'Think Tank', 'New Hampshire-based free-market think tank promoting liberty and limited government.', 'https://jbartlett.org', 'NH', 'Concord', 1000000, NULL, true),
('Empire Center for Public Policy', 'Think Tank', 'New York-based think tank promoting fiscal responsibility and transparency in state and local government.', 'https://www.empirecenter.org', 'NY', 'Albany', 1500000, '14-1902027', true),
('Yankee Institute for Public Policy', 'Think Tank', 'Connecticut-based free-market think tank promoting fiscal reform and limited government.', 'https://yankeeinstitute.org', 'CT', 'Hartford', 1500000, NULL, true),
('Cascade Policy Institute', 'Think Tank', 'Oregon-based free-market think tank promoting school choice and transportation reform.', 'https://cascadepolicy.org', 'OR', 'Portland', 1000000, '93-1045925', true),
('Washington Policy Center', 'Think Tank', 'Washington state-based free-market think tank promoting education reform and fiscal policy.', 'https://www.washingtonpolicy.org', 'WA', 'Seattle', 3000000, '91-1752769', true),
('Illinois Policy Institute', 'Think Tank', 'Illinois-based free-market think tank promoting government reform, fiscal responsibility, and workers'' rights.', 'https://www.illinoispolicy.org', 'IL', 'Chicago', 8000000, '41-2113659', true),
('Commonwealth Foundation', 'Think Tank', 'Pennsylvania-based free-market think tank promoting public sector reform and worker freedom.', 'https://www.commonwealthfoundation.org', 'PA', 'Harrisburg', 5000000, '23-2473845', true),
('Opportunity Solutions Project', '501(c)(4) Nonprofit', 'Conservative advocacy group promoting welfare reform and work requirements in public assistance programs.', 'https://opportunitysolutions.org', 'FL', 'Tallahassee', 10000000, NULL, true),
('Foundation for Government Accountability', '501(c)(3) Nonprofit', 'Conservative think tank focused on welfare reform, promoting work requirements and Medicaid restrictions.', 'https://thefga.org', 'FL', 'Naples', 12000000, '46-3057387', true),

-- ══════════════════════════════════════════════════════════════════
-- CONSULTING / LOBBYING / POLITICAL OPERATIONS
-- ══════════════════════════════════════════════════════════════════

('CRC Advisors', 'Consulting Firm', 'Conservative political consulting firm founded by former Trump campaign advisors.', NULL, 'VA', 'Arlington', 10000000, NULL, true),
('Kellyanne Conway Polling', 'Polling Firm', 'Polling firm founded by Kellyanne Conway serving Republican candidates and conservative organizations.', NULL, 'DC', 'Washington', 5000000, NULL, false),
('Leonard Leo Network', 'Other', 'Informal network of dark money organizations controlled by Federalist Society co-chair Leonard Leo.', NULL, 'DC', 'Washington', 0, NULL, false),

-- ══════════════════════════════════════════════════════════════════
-- PACS AND SUPER PACS
-- ══════════════════════════════════════════════════════════════════

('MAGA Inc.', 'Super PAC', 'Pro-Trump Super PAC that was the primary outside spending vehicle supporting Trump''s 2024 campaign.', NULL, 'DC', 'Washington', 150000000, NULL, true),
('Preserve America PAC', 'Super PAC', 'Pro-Trump Super PAC funded by major Republican megadonors like Miriam Adelson.', NULL, 'DC', 'Washington', 100000000, NULL, true),
('Winning for Women', 'PAC', 'Republican PAC dedicated to electing conservative women to Congress.', 'https://winningforwomen.com', 'DC', 'Washington', 5000000, NULL, true),
('American Crossroads', 'Super PAC', 'Republican Super PAC co-founded by Karl Rove to support GOP candidates and causes.', NULL, 'DC', 'Washington', 50000000, NULL, true),
('Crossroads GPS', '501(c)(4) Nonprofit', 'Dark money arm of Karl Rove''s Crossroads network used for issue advocacy without donor disclosure.', NULL, 'DC', 'Washington', 30000000, NULL, true),
('National Republican Senatorial Committee', 'Campaign Committee', 'Official campaign arm of the Republican Party dedicated to electing Republican senators.', 'https://www.nrsc.org', 'DC', 'Washington', 180000000, NULL, true),
('National Republican Congressional Committee', 'Campaign Committee', 'Official campaign arm of the Republican Party dedicated to electing Republican House members.', 'https://www.nrcc.org', 'DC', 'Washington', 200000000, NULL, true),
('Republican Governors Association', '527 Organization', 'Political organization supporting Republican gubernatorial candidates across the country.', 'https://www.rga.org', 'DC', 'Washington', 150000000, NULL, true),
('Republican Attorneys General Association', '527 Organization', 'Political organization supporting Republican candidates for state attorney general.', 'https://www.republicanags.com', 'DC', 'Washington', 30000000, NULL, true),
('Republican State Leadership Committee', '527 Organization', 'Organization dedicated to electing Republicans to state-level offices and legislatures.', 'https://rslc.gop', 'DC', 'Washington', 60000000, NULL, true),

-- ══════════════════════════════════════════════════════════════════
-- GRASSROOTS / ACTIVIST ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Tea Party Patriots', 'Grassroots Organization', 'Tea Party movement organization promoting fiscal responsibility, constitutionally limited government, and free markets.', 'https://www.teapartypatriots.org', 'GA', 'Atlanta', 5000000, '33-1040706', true),
('Judicial Crisis Network', '501(c)(4) Nonprofit', 'Dark money organization running ad campaigns to support or oppose judicial nominations, linked to Leonard Leo.', NULL, 'DC', 'Washington', 40000000, '26-1660384', true),
('True the Vote', '501(c)(3) Nonprofit', 'Conservative organization focused on election integrity and voter fraud claims.', 'https://truethevote.org', 'TX', 'Houston', 3000000, '27-2215780', true),
('Project Veritas', '501(c)(3) Nonprofit', 'Controversial conservative activist organization using undercover investigations and hidden cameras.', 'https://www.projectveritas.com', 'NY', 'Mamaroneck', 20000000, '27-2177466', true),
('Cleta Mitchell Network', 'Other', 'Conservative election lawyer Cleta Mitchell''s network promoting restrictive voting policies through the Election Integrity Network.', NULL, 'DC', 'Washington', 0, NULL, false),
('American Majority', '501(c)(3) Nonprofit', 'Conservative training organization teaching political activism and campaign skills to grassroots leaders.', 'https://americanmajority.org', 'VA', 'Purcellville', 3000000, '26-3020233', true),

-- ══════════════════════════════════════════════════════════════════
-- TRADE ASSOCIATIONS / BUSINESS GROUPS
-- ══════════════════════════════════════════════════════════════════

('U.S. Chamber of Commerce', 'Trade Association', 'Largest business lobbying organization in the US generally aligned with Republican pro-business policies.', 'https://www.uschamber.com', 'DC', 'Washington', 225000000, '53-0045720', true),
('National Federation of Independent Business', 'Trade Association', 'Small business trade association aligned with conservative and Republican economic policies.', 'https://www.nfib.com', 'TN', 'Nashville', 85000000, '36-0846728', true),
('National Association of Manufacturers', 'Trade Association', 'Manufacturing industry trade group generally aligned with Republican deregulation and trade policies.', 'https://www.nam.org', 'DC', 'Washington', 35000000, '53-0116380', true),
('Job Creators Network', '501(c)(4) Nonprofit', 'Conservative small business advocacy group opposing regulations and promoting free-market policies.', 'https://www.jobcreatorsnetwork.com', 'TX', 'Dallas', 15000000, '45-4522563', true),

-- ══════════════════════════════════════════════════════════════════
-- ADDITIONAL NOTABLE ORGANIZATIONS
-- ══════════════════════════════════════════════════════════════════

('Intercollegiate Studies Institute', '501(c)(3) Nonprofit', 'Conservative educational organization promoting classical liberal arts and Western civilization on college campuses.', 'https://isi.org', 'DE', 'Wilmington', 12000000, '23-1426960', true),
('National Taxpayers Union', '501(c)(4) Nonprofit', 'Conservative anti-tax organization advocating for lower taxes and reduced government spending.', 'https://www.ntu.org', 'VA', 'Alexandria', 3000000, '52-0955297', true),
('Americans for Limited Government', '501(c)(4) Nonprofit', 'Conservative advocacy group promoting limited government, free markets, and federalism.', 'https://getliberty.org', 'VA', 'Fairfax', 3000000, '03-0362626', true),
('David Horowitz Freedom Center', '501(c)(3) Nonprofit', 'Conservative organization combating what it describes as left-wing radicalism in academia and media.', 'https://www.horowitzfreedomcenter.org', 'CA', 'Sherman Oaks', 8000000, '95-4196915', true),
('Media Research Center', '501(c)(3) Nonprofit', 'Conservative media watchdog organization documenting and combating what it views as liberal media bias.', 'https://www.mrc.org', 'VA', 'Reston', 20000000, '52-1600471', true),
('Pacific Justice Institute', '501(c)(3) Nonprofit', 'Conservative legal defense organization specializing in religious freedom, parental rights, and traditional values.', 'https://www.pacificjustice.org', 'CA', 'Sacramento', 3000000, '91-2054033', true),
('American Values', '501(c)(4) Nonprofit', 'Conservative advocacy organization founded by Gary Bauer promoting traditional family values and religious liberty.', 'https://ouramericanvalues.org', 'DC', 'Washington', 2000000, '54-1949706', true),
('Council for Citizens Against Government Waste', '501(c)(3) Nonprofit', 'Conservative organization opposing government waste and advocating for fiscal responsibility.', 'https://www.cagw.org', 'DC', 'Washington', 4000000, '52-1355828', true),
-- Note: Judicial Watch already seeded in 002_seed_data.sql

ON CONFLICT DO NOTHING;
