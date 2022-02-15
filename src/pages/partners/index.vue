<template>
  <main role="main">
    <!-- breadcrumb-->
    <b-container>
      <Breadcrumb :breadcrumb_items="breadcrumb_items" />
    </b-container>
    <!-- page intro-->
    <b-container>
      <!-- heading-->
      <div class="headingtext">
        <h1>STIRDATA Partners</h1>
        <p class="half">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam.
        </p>
      </div>
    </b-container>
    <!-- child page-->
    <section class="two-columns">
      <b-container>
        <b-row>
          <!-- column-->
          <b-col lg="3" xl="3" class="two-columns-sidebar">
            <!-- ads-->
            <div class="ads">
              <div class="ads-learn">
                <img class="decor" src="../../assets/img/ic-ads.png" />
                <p>
                  STIRDATA is an online platform for searching, navigating,
                  synthetically analyzing, and visualizing company related open
                  data content
                </p>
                <!-- button nav-->
                <nav class="heronav">
                  <ul>
                    <li>
                      <b-link class="button" :to="{ name: 'about' }"
                        >Learn More</b-link
                      >
                    </li>
                  </ul>
                </nav>
              </div>
              <!-- ads-->
              <div class="ads-explore">
                <h2>Explore <br />Companies</h2>
                <p>
                  Search, Navigate, Analyze, and Visualizing Company related
                  Open Data Content
                </p>
                <!-- button nav-->
                <nav class="heronav">
                  <ul>
                    <li>
                      <b-link class="button" :to="{ name: 'search' }"
                        >Explore Now</b-link
                      >
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </b-col>
          <!-- column-->
          <b-col lg="9" xl="9" class="two-columns-content">
            <!-- ul-->
            <ul class="partnerlist">
              <li>
                <img class="logos" src="../../assets/img/logo-ntua.png" />
                <h2>
                  National Technical University of Athens<span
                    class="coordinator"
                    >COORDINATOR</span
                  >
                </h2>
                <p>
                  The National Technical University of Athens is the oldest
                  educational institution of Greece in the field of technology,
                  and has contributed unceasingly to the country’s scientific,
                  technical and economic development since its foundation in
                  1836. The Intelligent Systems, Content & Interaction Lab
                  (ISCIL) was established in 1989, in the School of Computer and
                  Electrical Engineering and the Institute of Computer and
                  Communication Systems of NTUA. ISCIL has a leading expertise
                  in theoretical and experimental aspects of machine learning
                  and intelligent systems, related to analysis of information,
                  knowledge extraction & representation, adaptation to context
                  and extensive collaborative, coordinating and administrative
                  experience. Since 2004, ISCIL is the main body that drives
                  technological progress forward in the fields of digitisation,
                  documentation and identification of cultural content on a
                  national and European scale, actively participating as a
                  technical partner in the creation and development of the
                  European Digital Library - Europeana.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-karlova.jpeg" />
                <h2>Univerzita Karlova</h2>
                <p>
                  The School of Computer Science at the Faculty of Mathematics
                  and Physics at Charles University brings its expertise with
                  linked and open data, data interoperability, semantic data
                  modeling and government data gained in numerous national and
                  international research and applied research projects. Their
                  tools for linked data publication and processing are used by
                  institutions of public administration and universities both in
                  the Czech Republic and worldwide.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-masarykova.jpeg" />
                <h2>Masarykova Univerzita</h2>
                <p>
                  Masaryk University is the second-largest public university in
                  the Czech Republic. The Institute of Law and Technology is an
                  academic institute of the Faculty of Law of Masaryk University
                  and the first academic centre in the Czech Republic that
                  focuses on technology law. For over ten years, the Institute
                  of Law and Technology team has been involved in research and
                  teaching of topics relating to technology law, such as
                  copyright, personal data protection, e-government, PSI,
                  cybercrime, cyber security, legal informatics and others.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-digdir.jpeg" />
                <h2>DIGITALISERINGSDIREKTORATET</h2>
                <p>
                  The Norwegian Digitalisation Agency is the Norwegian
                  government’s foremost tool for faster and more coordinated
                  digitalisation of the Norwegian public sector. The Norwegian
                  Digitalisation Agency is subordinate to the Ministry of Local
                  Government and Modernisation. The role of rule setter within
                  digitalisation, expertise within information security,
                  responsibility for the operation of common IT solutions, the
                  Co-Financing Scheme and innovation scheme Stimulab, as well as
                  the Authority for Universal Design of ICT, are all part of the
                  Norwegian Digitalisation Agency.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-bronnoysundregistrene.jpeg" />
                <h2>Registerenheten I Bronnoysund</h2>
                <p>
                  The Brønnøysund Register Centre develops and operates many of
                  the nation’s most important business registers and provides
                  national guidance and services for businesses. The Brønnøysund
                  Register Centre engages in data-driven development in close
                  cooperation with the business community to simplify for
                  business and industry, and has the ambition to be the
                  government’s most important instrument for simplification for
                  the businesses. The Brønnøysund Register Centre is a public
                  agency under the Ministry of Trade, Industry and Fisheries in
                  Norway and performs a number of tasks for other ministries as
                  well. It has 450 employees and its budget is part of the
                  national budget.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-mindigital.jpeg" />
                <h2>Ministry of Digital Government</h2>
                <p>
                  The Ministry of Digital Governance is a new unit of public
                  administration which for the first time brings together all
                  the critical IT and telecommunications structures related to
                  the provision of electronic services to citizens and the wider
                  digital transformation of the country. Furthermore, the
                  purpose of the Ministry is before the conversion of any
                  process to digital, to simplify it first in order to avoid the
                  digitization of the bureaucracy. Until now, digital politics,
                  e-government and citizen service have been in different
                  organizational units. At the same time, the critical state
                  information systems were scattered, resulting in parallel or
                  even contradictory planning, overlapping projects and the
                  waste of public money in general. Now, the unified structure
                  at the operational level comes to correct the fragmentation of
                  units and systems that affects the quality and cost of
                  services provided. Of course, the above scheme presupposes the
                  continuous and uninterrupted cooperation between ministries
                  and agencies as the purpose of this Ministry is precisely the
                  interoperability at all levels.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-acci.jpeg" />
                <h2>Athens Chamber of Commerce and Industry</h2>
                <p>
                  The Athens Chamber of Commerce and Industry (ACCI) is a public
                  agency founded in 1919. It promotes trade by acting as an
                  advisor to the Greek Government, offering educational services
                  to its members as well as others, organizing trade missions,
                  acting as an information hub for trade and companies, and
                  offering several publications (mainly electronically). ACCI
                  maintains Business Registry for Athens region, which
                  interoperates with National Business Registry (GEMI). It also
                  maintains the Exporters registry, and the Commercial
                  Representatives registry. ACCI currently represents 108.000
                  commercial and industrial enterprises, and employs
                  approximately 180 employees.
                </p>
              </li>
              <li>
                <img class="logos" src="../../assets/img/logo-thinkcode.jpeg" />
                <h2>Thinkcode Ltd.</h2>
                <p>
                  ThinkCode is a start-up company that designs and develops
                  custom intelligent solutions and high-end software products by
                  adopting and applying cutting-edge Artificial Intelligence
                  technology into real-word applications. Its services span a
                  great range of applications from Image Annotation and Named
                  Entity Recognition to Audio Annotation and Crowdsourcing.
                  ThinkCode does not limit itself to developing and applying AI
                  algorithms to images, text and sound, but produces high
                  quality visualisation tools for any of the above services.
                  This is achieved through intuitive graphical user interfaces,
                  conforming to strict design principles in order to improve the
                  user experience, thus resulting in a complete end-to-end AI
                  software service.
                </p>
              </li>
            </ul>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </main>
</template>

<script>
export default {
  components: {
    Breadcrumb: () => import("../../components/Breadcrumb"),
  },

  data() {
    return {
      breadcrumb_items: [
        {
          text: "HOME",
          to: { name: "index" },
        },
        {
          text: "PARTNERS",
          active: true,
        },
      ],
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";
</style>
