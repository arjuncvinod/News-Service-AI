/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./index.css";
import "./pdfstyle.css";


const NewspaperPDF = ({ news }) => {
  const [newsData, setNewsData] = useState([]);
  
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const uniqueCategories = new Set();
    const categorizedNews = [];
    
 
    const shuffledNews = [...news].sort(() => 0.5 - Math.random());


    for (const article of shuffledNews) {
      if (!uniqueCategories.has(article.category)) {
        uniqueCategories.add(article.category);
        categorizedNews.push(article);
      }
  
      if (categorizedNews.length === 5) break;
    }

  
    setNewsData(categorizedNews);
  }, [news]);

 
  const generatePDF = () => {
    const input = document.getElementById("newspaperPreview");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

    
      const imgWidth = 210; 
      const imgHeight = (canvas.height * imgWidth) / canvas.width; 

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("newspaper.pdf"); 
    });
  };

  return (
    <div>
      <h1 className="h1">Newspaper Editor</h1>

 
      <div id="newspaperPreview" className="newspaper-preview">
        <div className="newspaperContainer">
          <nav>
            <div className="topInfo">
              <h3>{currentDate}</h3>
              <h3>Price : 10</h3>
            </div>
            <hr />
            <h1>NEWS SCADE</h1>
            <hr />
            <div className="btmInfo">
              <h3>World</h3>
              <h3>•</h3>
              <h3>India</h3>
              <h3>•</h3>
              <h3>Kerala</h3>
              <h3>•</h3>
              <h3>Education</h3>
              <h3>•</h3>
              <h3>Lifestyle</h3>
              <h3>•</h3>
              <h3>Politics</h3>
            </div>
          </nav>
          <section>
            {newsData.length === 0 ? (
              <p>No news articles available.</p>
            ) : (
              <div className="col1">
                {/* News 1 */}
                <div className="col1-row1">
                  <div className="col1-row1-col1">
                    <h4>{newsData[0]?.title || "News 1 Head"}</h4>
                    <p>{newsData[0]?.content || "News 1 Description"}</p>
                  </div>
                  <div className="col1-row1-col2">
                    <div className="col1-row1-col2-row1">
                      <h3>{newsData[1]?.title || "News 2 Head"}</h3>
                      {newsData[1]?.urlToImage && (
                        <img
                          src={newsData[1].urlToImage}
                          alt="News 2 Image"
                          onLoad={() => console.log("Image 2 loaded")}
                        />
                      )}
                    </div>
                    <div className="col1-row1-col2-row2">
                      <div className="col1-row1-col2-row2-col1">
                        <p>{newsData[1]?.content.slice(0, 1100) || "News 2 Description"}</p>
                      </div>
                      <div className="col1-row1-col2-row2-col2">
                        <p>
                          {newsData[1]?.content.slice(1100) || "News 2 Description Continuation"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* News 3 */}
                <div className="col1-row2">
                  <div className="col1-row2-col1">
                    <div className="col1-row2-col1-row1">
                      <h4>{newsData[2]?.title || "News 3 Head"}</h4>
                    </div>
                    <div className="col1-row2-col1-row2">
                      <div className="col1-row2-col1-row2-col1">
                        <p>{newsData[2]?.content.slice(0, 1496) || "News 3 Description"}</p>
                      </div>
                      <div className="col1-row2-col1-row2-col2">
                        <p>{newsData[2]?.content.slice(1497) || "News 3 Description Continuation"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col1-row2-col2">
                    {newsData[2]?.urlToImage && (
                      <img
                        src={newsData[2].urlToImage}
                        alt="News 3 Image"
                        onLoad={() => console.log("Image 3 loaded")}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* News 4 & News 5 */}
            <div className="col2">
              <div className="col2-row1">
                <h4>{newsData[3]?.title || "News 4 Head"}</h4>
                <p>{newsData[3]?.content || "News 4 Description"}</p>
              </div>
              <div className="col2-row2">
                {newsData[4]?.urlToImage && (
                  <img
                    src={newsData[4].urlToImage}
                    alt="News 5 Image"
                    onLoad={() => console.log("Image 5 loaded")}
                  />
                )}
                <h4>{newsData[4]?.title || "News 5 Head"}</h4>
                <p>{newsData[4]?.content || "News 5 Description"}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Button to generate PDF */}
      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
};

export default NewspaperPDF;
