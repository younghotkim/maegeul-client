import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

// Word 타입 정의 (size와 color 포함)
type Word = {
  text: string;
  size: number;
  color: string;
};

interface D3WordCloudProps {
  words: Word[];
  fontFamily?: string; // 폰트 지정 (기본값 설정 가능)
}

const D3WordCloud: React.FC<D3WordCloudProps> = ({
  words,
  fontFamily = "Plus Jakarta Sans",
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // 부모 요소의 크기를 측정하기 위한 ref

  useEffect(() => {
    const svgElement = svgRef.current;
    const containerElement = containerRef.current;

    if (!svgElement || !containerElement) return;

    // 부모 요소 크기 측정
    const { width, height } = containerElement.getBoundingClientRect();

    // 이전 SVG 내용 제거
    d3.select(svgElement).selectAll("*").remove();

    const layout = cloud<cloud.Word>()
      .size([width, height]) // 부모 요소 크기에 맞게 설정
      .words(
        words.map((word) => ({
          text: word.text,
          size: word.size,
          color: word.color, // 추가된 color 속성
        })) as cloud.Word[] // cloud.Word 타입으로 변환
      )
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 90 : 0))
      .fontSize((d) => d.size || 10)
      .font(fontFamily) // 지정된 폰트 사용
      .on("end", draw);

    layout.start();

    function draw(words: cloud.Word[]) {
      const svg = d3
        .select(svgElement)
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1]) // SVG 높이 설정
        .append("g")
        .attr(
          "transform",
          `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`
        );

      const texts = svg
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .style("font-size", (d) => `${d.size}px`)
        .style("font-family", "Plus Jakarta Sans, sans-serif")
        .style("fill", (d: any) => (d.color ? d.color : "#000000"))
        .text((d) => d.text || "");

      // 애니메이션 적용
      texts
        .attr("transform", (d) => `translate(0, 0)rotate(${d.rotate})`) // 시작 위치를 0,0으로 설정
        .transition()
        .duration(1000)
        .attr(
          "transform",
          (d) => `translate(${d.x},${d.y})rotate(${d.rotate})`
        );
    }
  }, [words, fontFamily]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};

export default D3WordCloud;
