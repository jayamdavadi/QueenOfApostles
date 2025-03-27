import React from 'react';
import { Users, MapPin, Phone, Mail } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          About Us
        </h1>

        <div className="mb-12">
          <h2 className="text-2xl font-bold flex items-center mb-6">
            <Users className="w-6 h-6 mr-2" />
            Our Team
          </h2>

          <div className="space-y-12">
            {/* First Personnel */}
            <div className="border-b pb-8">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                  <div className="bg-gray-200 rounded-lg h-60 w-full flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Photo</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4 md:pl-8">
                  <h3 className="text-xl font-bold mb-2">Fr. Pawel Nyrek OMI</h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-4">Director of Queen of Apostles</h4>
                  <p className="text-gray-700 mb-4">
                    Fr. Pawel Nyrek OMI was born on March 29, 1982 in Poland, very close to the Baltic Sea. He grew up and started school at Łeba, where there is also an Oblate parish. After high school he went to the novitiate, took his first vows on September 8, 2002 and soon after began Higher Seminary in Obra.
                  </p>
                  <p className="text-gray-700 mb-4">
                    He was ordained a priest in May 2008. He came to Canada on July 5, 2008. For five years he worked in Mississauga, at St. Maximilian Kolbe Parish. Later on, he was sent to Dartmouth (Nova Scotia) to practice English. After that he was in Edmonton, Toronto (working as an Associate Pastor).
                  </p>
                  <p className="text-gray-700">
                    He was appointed Provincial Treasurer in 2018 and send to Holy Angels Parish in Etobicoke as a resident. He was appointed Director of Queen Of Apostles in September 2022.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Personnel */}
            <div className="border-b pb-8">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                  <div className="bg-gray-200 rounded-lg h-60 w-full flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Photo</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4 md:pl-8">
                  <h3 className="text-xl font-bold mb-2">Fr. Pawel Ratajczak OMI</h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-4">Program Director of Queen of Apostles</h4>
                  <p className="text-gray-700 mb-4">
                    Fr. Pawel Ratajczak, O.M.I., was born in Białystok, Poland, and immigrated to Canada with his family in 1986. After finishing high school in Mississauga, he completed a Bachelor of Arts in Political Science at the University of Waterloo. Fr. Pawel joined the Missionary Oblates of Mary Immaculate (Assumption Province) in 1999.
                  </p>
                  <p className="text-gray-700 mb-4">
                    During initial formation he studied at Newman Theological College in Edmonton, Alberta, and subsequently at St. Paul University and the University of Ottawa. At the two latter institutions, he earned an ecclesiastical baccalaureate (S.T.B.) concurrently with a bachelor's degree, both in Theology.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Fr. Pawel was ordained a priest in January of 2007. Initially, he served as an Associate Pastor at St. Casimir's Parish in Toronto, and then spent almost four years as the Director of Catholic Youth Studio, a daily Polish radio program, broadcast in the Greater Toronto Area.
                  </p>
                  <p className="text-gray-700 mb-4">
                    In June of 2013, Fr. Pawel was sent for studies to the Pontifical Gregorian University in Rome. There, in 2015, he completed an ecclesiastical licence (S.T.L.) and, in 2017, defended an ecclesiastical doctorate (S.T.D.) in Theology, with a specialization in Spirituality. Fr. Pawel's doctoral dissertation was entitled "Participation in God and Its Relation to Koinonia-Communio in Select Writings (1945-1978) of Karol Wojtyła: Implications for a Spirituality of Marriage".
                  </p>
                  <p className="text-gray-700">
                    From September 2018, to August 2024, Fr. Pawel served as Pastor of St. Hedwig's Parish in Barry's Bay, Ontario. Since 2018, he works as a sessional instructor at Our Lady Seat of Wisdom College, in Barry's Bay. There, he teaches courses in Trinity, Christology, and States of Life. In September of 2024, Fr. Pawel began a new assignment, as Program Director at Queen of Apostles Renewal Center.
                  </p>
                </div>
              </div>
            </div>

            {/* Third Personnel */}
            <div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                  <div className="bg-gray-200 rounded-lg h-60 w-full flex items-center justify-center">
                    <p className="text-gray-500 text-lg">Photo</p>
                  </div>
                </div>
                <div className="w-full md:w-3/4 md:pl-8">
                  <h3 className="text-xl font-bold mb-2">Mrs. Anne Hales</h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-4">Spiritual Care</h4>
                  <p className="text-gray-700">
                    Mrs. Anne Hales, was born in Toronto. She is married, a mother of two sons, and grandmother to two boys. Her ministry in the Archdiocese of Toronto began in her home parish in 1965. Anne joined the Oblate retreat staff at the Centre in 1985. She preaches retreats with the Oblates and is a certified spiritual director.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <div className="space-y-2">
            <p className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Queen of Apostles Renewal Centre
            </p>
            <p className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-2 text-blue-600" />
              +1 (905) 278-5229
            </p>
            <p className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-2 text-blue-600" />
              info@qoa.ca
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          © 2024 Queen of Apostles Renewal Centre. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 