import svgPaths from "./svg-kre03643je";

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[1.2px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Repository URL</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#60a5fa] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">github.com/enterprise-core/v3-deployment-engine</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[1.2px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Team Name</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e5e7eb] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Infrastructure-A</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container5 />
      <Container6 />
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[1.2px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Team Leader</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#e5e7eb] text-[14px] w-full">
        <p className="leading-[20px] whitespace-pre-wrap">Marcus Vance</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start min-h-px min-w-px relative self-stretch" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container7 />
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] tracking-[1.2px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Active Branch</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#1f2937] content-stretch flex items-start px-[9px] py-[4px] relative rounded-[4px] shrink-0" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] w-[165.64px]">
        <p className="leading-[16px] whitespace-pre-wrap">release/v3.4.1-patch-02</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <BackgroundBorder />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container12 />
    </div>
  );
}

function LeftColumnRepoDetails() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Left Column: Repo Details">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative w-full">
        <Container />
        <Container3 />
        <Container10 />
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center uppercase w-[58.81px]">
        <p className="leading-[16px] whitespace-pre-wrap">Failures</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <Container16 />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[24px] text-center w-[26.7px]">
        <p className="leading-[32px] whitespace-pre-wrap">02</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center uppercase w-[34.5px]">
        <p className="leading-[16px] whitespace-pre-wrap">Fixes</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <Container18 />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[24px] text-center w-[26.7px]">
        <p className="leading-[32px] whitespace-pre-wrap">14</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center uppercase w-[90.91px]">
        <p className="leading-[16px] whitespace-pre-wrap">Analysis Time</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0" data-name="Container">
      <Container20 />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#e5e7eb] text-[24px] text-center w-[46.72px]">
        <p className="leading-[32px] whitespace-pre-wrap">1.4s</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0 w-full" data-name="Container">
      <Container15 />
      <Container17 />
      <Container19 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Operation Status</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="h-[8px] relative shrink-0 w-[16px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[8px] relative size-full">
        <div className="bg-[#10b981] rounded-[9999px] shrink-0 size-[8px]" data-name="Background" />
      </div>
    </div>
  );
}

function OverlayBorderShadow() {
  return (
    <div className="bg-[rgba(16,185,129,0.1)] content-stretch flex items-center px-[17px] py-[7px] relative rounded-[9999px] shrink-0" data-name="Overlay+Border+Shadow">
      <div aria-hidden="true" className="absolute border border-[rgba(16,185,129,0.5)] border-solid inset-0 pointer-events-none rounded-[9999px] shadow-[0px_0px_15px_0px_rgba(16,185,129,0.3)]" />
      <Margin />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#34d399] text-[12px] tracking-[-0.6px] w-[159.89px]">
        <p className="leading-[16px] whitespace-pre-wrap">PASSED SYSTEM VALIDATION</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="Container">
      <Container22 />
      <OverlayBorderShadow />
    </div>
  );
}

function Container13() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[24px] items-start relative">
        <Container14 />
        <Container21 />
      </div>
    </div>
  );
}

function RightColumnStatusMetrics() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Right Column: Status & Metrics">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-l border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start pb-[22px] pl-[33px] relative w-full">
        <Container13 />
      </div>
    </div>
  );
}

function Section1SummaryInformation() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(23,23,26,0.7)] relative rounded-[8px] shrink-0 w-full" data-name="Section 1 - Summary Information">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex gap-[32px] items-start justify-center pb-[21px] pt-[25px] px-[25px] relative w-full">
          <LeftColumnRepoDetails />
          <RightColumnStatusMetrics />
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px] whitespace-pre-wrap">Score Breakdown</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Paragraph">
      <div className="flex flex-col h-[16px] justify-center relative shrink-0 text-[#6b7280] text-[12px] w-[62.02px]">
        <p className="leading-[16px] whitespace-pre-wrap">Base Score</p>
      </div>
      <div className="flex flex-col h-[28px] justify-center relative shrink-0 text-[#e5e7eb] text-[20px] w-[33.38px]">
        <p className="leading-[28px] whitespace-pre-wrap">100</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Paragraph">
      <div className="flex flex-col h-[16px] justify-center relative shrink-0 text-[#6b7280] text-[12px] w-[72.06px]">
        <p className="leading-[16px] whitespace-pre-wrap">Speed Bonus</p>
      </div>
      <div className="flex flex-col h-[28px] justify-center relative shrink-0 text-[#60a5fa] text-[20px] w-[33.92px]">
        <p className="leading-[28px] whitespace-pre-wrap">+10</p>
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Paragraph">
      <div className="flex flex-col h-[16px] justify-center relative shrink-0 text-[#6b7280] text-[12px] w-[94.47px]">
        <p className="leading-[16px] whitespace-pre-wrap">Efficiency Penalty</p>
      </div>
      <div className="flex flex-col h-[28px] justify-center relative shrink-0 text-[#f87171] text-[20px] w-[17.78px]">
        <p className="leading-[28px] whitespace-pre-wrap">-6</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex font-['Nimbus_Sans:Regular',sans-serif] gap-[48px] items-start leading-[0] not-italic relative shrink-0 w-full" data-name="Container">
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function SegmentedProgressBar() {
  return (
    <div className="content-stretch flex gap-[4px] h-[8px] items-start relative shrink-0 w-full" data-name="Segmented Progress Bar">
      <div className="bg-[#2563eb] h-full rounded-bl-[2px] rounded-tl-[2px] shrink-0 w-[448.8px]" data-name="Background" />
      <div className="bg-[#059669] h-full shrink-0 w-[224.41px]" data-name="Background" />
      <div className="bg-[#dc2626] h-full opacity-50 rounded-br-[2px] rounded-tr-[2px] shrink-0 w-[74.8px]" data-name="Background" />
    </div>
  );
}

function ScoreBreakdown() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-[756px]" data-name="Score Breakdown">
      <Heading />
      <Container24 />
      <SegmentedProgressBar />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-end relative w-full">
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] text-right uppercase w-[178.08px]">
          <p className="leading-[16px] whitespace-pre-wrap">Final Performance Score</p>
        </div>
      </div>
    </div>
  );
}

function FinalScoreDisplay() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-end pl-[33px] relative shrink-0 w-[362px]" data-name="Final Score Display">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-l border-solid inset-0 pointer-events-none" />
      <Container25 />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[60px] justify-center leading-[0] not-italic relative shrink-0 text-[60px] text-right text-white tracking-[-3px] w-[91.09px]">
        <p className="leading-[60px] whitespace-pre-wrap">104</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[32px] items-center justify-center relative w-full">
        <ScoreBreakdown />
        <FinalScoreDisplay />
      </div>
    </div>
  );
}

function Section2ScoreAnalysis() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(23,23,26,0.7)] relative rounded-[8px] shrink-0 w-full" data-name="Section 2 - Score Analysis">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col items-start p-[25px] relative w-full">
        <Container23 />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] whitespace-pre-wrap">File-Level Analysis Report</p>
        </div>
      </div>
    </div>
  );
}

function OverlayHorizontalBorder() {
  return (
    <div className="bg-[rgba(255,255,255,0.05)] relative shrink-0 w-full" data-name="Overlay+HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[17px] pt-[16px] px-[24px] relative w-full">
        <Heading1 />
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[24px] relative shrink-0 w-[392.94px]" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] tracking-[1px] uppercase w-[100.03px]">
        <p className="leading-[20px] whitespace-pre-wrap">File Reference</p>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[24px] relative shrink-0 w-[200.83px]" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] tracking-[1px] uppercase w-[59.11px]">
        <p className="leading-[20px] whitespace-pre-wrap">Bug Type</p>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[24px] relative shrink-0 w-[157.19px]" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] tracking-[1px] uppercase w-[26.78px]">
        <p className="leading-[20px] whitespace-pre-wrap">Line</p>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[24px] relative shrink-0 w-[224.58px]" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] tracking-[1px] uppercase w-[82.33px]">
        <p className="leading-[20px] whitespace-pre-wrap">Commit Hash</p>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[13px] pt-[12px] px-[24px] relative shrink-0 w-[222.47px]" data-name="Cell">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] tracking-[1px] uppercase w-[44.17px]">
        <p className="leading-[20px] whitespace-pre-wrap">Status</p>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="bg-[rgba(0,0,0,0.4)] content-stretch flex items-start justify-center relative shrink-0 w-full" data-name="Header → Row">
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
      <Cell4 />
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative shrink-0 w-[392.94px]" data-name="Data">
      <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] w-[172.83px]">
        <p className="leading-[16px] whitespace-pre-wrap">src/auth/jwt_provider.py</p>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(127,29,29,0.3)] h-[16px] relative rounded-[2px] shrink-0 w-[68.55px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(153,27,27,0.5)] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] left-[9px] not-italic text-[#f87171] text-[10px] top-[8px] uppercase w-[50.55px]">
        <p className="leading-[20px] whitespace-pre-wrap">Security</p>
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative shrink-0 w-[200.83px]" data-name="Data">
      <OverlayBorder />
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative shrink-0 w-[157.19px]" data-name="Data">
      <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] w-[43.22px]">
        <p className="leading-[16px] whitespace-pre-wrap">142:04</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative shrink-0 w-[224.58px]" data-name="Data">
      <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[50.42px]">
        <p className="leading-[16px] whitespace-pre-wrap">8f2a11b</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p2e4af7c0} fill="var(--fill-0, #10B981)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[12px]" data-name="SVG">
      <Svg1 />
    </div>
  );
}

function SvgMargin() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pr-[4px] relative shrink-0 w-[16px]" data-name="SVG:margin">
      <Svg />
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex items-center pl-[24px] relative shrink-0 w-[198.47px]" data-name="Data">
      <SvgMargin />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[10px] uppercase w-[65.09px]">
        <p className="leading-[20px] whitespace-pre-wrap">Remediated</p>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row 1">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] relative w-full">
          <Data />
          <Data1 />
          <Data2 />
          <Data3 />
          <Data4 />
        </div>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="relative shrink-0 w-[392.94px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] w-[180.03px]">
          <p className="leading-[16px] whitespace-pre-wrap">lib/db/connection_pool.go</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="bg-[rgba(120,53,15,0.3)] h-[16px] relative rounded-[2px] shrink-0 w-[64.03px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(146,64,14,0.5)] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] left-[9px] not-italic text-[#fbbf24] text-[10px] top-[8px] uppercase w-[46.03px]">
        <p className="leading-[20px] whitespace-pre-wrap">Latency</p>
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[200.83px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative w-full">
        <OverlayBorder1 />
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[157.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] w-[36.02px]">
          <p className="leading-[16px] whitespace-pre-wrap">88:12</p>
        </div>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[224.58px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[50.42px]">
          <p className="leading-[16px] whitespace-pre-wrap">ac92e10</p>
        </div>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="SVG">
      <svg className="absolute block inset-0" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path clipRule="evenodd" d={svgPaths.p2e4af7c0} fill="var(--fill-0, #10B981)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[12px]" data-name="SVG">
      <Svg3 />
    </div>
  );
}

function SvgMargin1() {
  return (
    <div className="content-stretch flex flex-col h-[12px] items-start pr-[4px] relative shrink-0 w-[16px]" data-name="SVG:margin">
      <Svg2 />
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[198.47px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[24px] relative w-full">
        <SvgMargin1 />
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[10px] uppercase w-[54.39px]">
          <p className="leading-[20px] whitespace-pre-wrap">Optimized</p>
        </div>
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row 2">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] pt-px relative w-full">
          <Data5 />
          <Data6 />
          <Data7 />
          <Data8 />
          <Data9 />
        </div>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[392.94px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18px] pt-[18.5px] px-[24px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#d1d5db] text-[12px] w-[158.44px]">
          <p className="leading-[16px] whitespace-pre-wrap">api/v1/user_handler.js</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder2() {
  return (
    <div className="bg-[rgba(30,58,138,0.3)] h-[16px] relative rounded-[2px] shrink-0 w-[49.38px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(30,64,175,0.5)] border-solid inset-0 pointer-events-none rounded-[2px]" />
      <div className="-translate-y-1/2 absolute flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] left-[9px] not-italic text-[#60a5fa] text-[10px] top-[8px] uppercase w-[31.38px]">
        <p className="leading-[20px] whitespace-pre-wrap">Logic</p>
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[200.83px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18px] pt-[18.5px] px-[24px] relative w-full">
        <OverlayBorder2 />
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[157.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18px] pt-[18.5px] px-[24px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] w-[43.22px]">
          <p className="leading-[16px] whitespace-pre-wrap">210:09</p>
        </div>
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[224.58px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18px] pt-[18.5px] px-[24px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] w-[50.42px]">
          <p className="leading-[16px] whitespace-pre-wrap">f102c9a</p>
        </div>
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[198.47px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[24px] relative w-full">
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[20px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] uppercase w-[46.7px]">
          <p className="leading-[20px] whitespace-pre-wrap">Ignored</p>
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="mb-[-1px] relative shrink-0 w-full" data-name="Row 3">
      <div aria-hidden="true" className="absolute border-[#1f2937] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[24px] pt-px relative w-full">
          <Data10 />
          <Data11 />
          <Data12 />
          <Data13 />
          <Data14 />
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start pb-px relative shrink-0 w-full" data-name="Body">
      <Row />
      <Row1 />
      <Row2 />
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] w-full">
        <HeaderRow />
        <Body />
      </div>
    </div>
  );
}

function Section3EnterpriseDataTable() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(23,23,26,0.7)] relative rounded-[8px] shrink-0 w-full" data-name="Section 3 - Enterprise Data Table">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">
        <OverlayHorizontalBorder />
        <Table />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_24px_-1px_rgba(0,0,0,0.5)]" />
    </div>
  );
}

function Heading2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] whitespace-pre-wrap">Pipeline Sequence</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder3() {
  return (
    <div className="bg-[rgba(16,185,129,0.2)] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[40px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[#10b981] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#34d399] text-[12px] text-center w-[13.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">01</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] uppercase w-[74.13px]">
        <p className="leading-[15px] whitespace-pre-wrap">Initialization</p>
      </div>
    </div>
  );
}

function OverlayBorder4() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.2)] content-stretch flex flex-col items-start left-[17.5px] px-[9px] py-[5px] rounded-[4px] top-[-24px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(16,185,129,0.4)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[8px] w-[21.13px]">
        <p className="leading-[12px] whitespace-pre-wrap">PASS</p>
      </div>
    </div>
  );
}

function TimelineNodes() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Timeline Nodes">
      <OverlayBorder3 />
      <Container27 />
      <OverlayBorder4 />
    </div>
  );
}

function OverlayBorder5() {
  return (
    <div className="bg-[rgba(16,185,129,0.2)] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[40px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[#10b981] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#34d399] text-[12px] text-center w-[13.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">02</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] uppercase w-[57.02px]">
        <p className="leading-[15px] whitespace-pre-wrap">SAST Scan</p>
      </div>
    </div>
  );
}

function OverlayBorder6() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.2)] content-stretch flex flex-col items-start left-[8.94px] px-[9px] py-[5px] rounded-[4px] top-[-24px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(16,185,129,0.4)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[8px] w-[21.13px]">
        <p className="leading-[12px] whitespace-pre-wrap">PASS</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Container">
      <OverlayBorder5 />
      <Container29 />
      <OverlayBorder6 />
    </div>
  );
}

function OverlayBorder7() {
  return (
    <div className="bg-[rgba(239,68,68,0.2)] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[40px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[#ef4444] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#f87171] text-[12px] text-center w-[13.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">03</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] uppercase w-[68.89px]">
        <p className="leading-[15px] whitespace-pre-wrap">Dependency</p>
      </div>
    </div>
  );
}

function OverlayBorder8() {
  return (
    <div className="absolute bg-[rgba(239,68,68,0.2)] content-stretch flex flex-col items-start left-[16.8px] px-[9px] py-[5px] rounded-[4px] top-[-24px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(239,68,68,0.4)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#ef4444] text-[8px] w-[17.28px]">
        <p className="leading-[12px] whitespace-pre-wrap">FAIL</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Container">
      <OverlayBorder7 />
      <Container31 />
      <OverlayBorder8 />
    </div>
  );
}

function OverlayBorder9() {
  return (
    <div className="bg-[rgba(16,185,129,0.2)] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[40px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[#10b981] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#34d399] text-[12px] text-center w-[13.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">04</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] uppercase w-[46.92px]">
        <p className="leading-[15px] whitespace-pre-wrap">Auto-Fix</p>
      </div>
    </div>
  );
}

function OverlayBorder10() {
  return (
    <div className="absolute bg-[rgba(16,185,129,0.2)] content-stretch flex flex-col items-start left-[3.89px] px-[9px] py-[5px] rounded-[4px] top-[-24px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(16,185,129,0.4)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[8px] w-[21.13px]">
        <p className="leading-[12px] whitespace-pre-wrap">PASS</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Container">
      <OverlayBorder9 />
      <Container33 />
      <OverlayBorder10 />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#1f2937] content-stretch flex items-center justify-center p-px relative rounded-[4px] shrink-0 size-[40px]" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#374151] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[16px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[12px] text-center w-[13.36px]">
        <p className="leading-[16px] whitespace-pre-wrap">05</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[10px] uppercase w-[68.39px]">
        <p className="leading-[15px] whitespace-pre-wrap">Deployment</p>
      </div>
    </div>
  );
}

function OverlayBorder11() {
  return (
    <div className="absolute bg-[rgba(59,130,246,0.2)] content-stretch flex flex-col items-start left-[10.95px] px-[9px] py-[5px] rounded-[4px] top-[-24px]" data-name="Overlay+Border">
      <div aria-hidden="true" className="absolute border border-[rgba(59,130,246,0.4)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] h-[12px] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[8px] uppercase w-[28.47px]">
        <p className="leading-[12px] whitespace-pre-wrap">Queue</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0" data-name="Container">
      <BackgroundBorder1 />
      <Container35 />
      <OverlayBorder11 />
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pl-[16px] pr-[16.03px] relative w-full">
          <div className="-translate-y-1/2 absolute bg-[#1f2937] h-px left-0 right-0 top-1/2" data-name="Horizontal Line Background" />
          <TimelineNodes />
          <Container28 />
          <Container30 />
          <Container32 />
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Section4DesktopTimeline() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(23,23,26,0.7)] relative rounded-[8px] shrink-0 w-full" data-name="Section 4 - Desktop Timeline">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[25px] relative w-full">
        <Heading2 />
        <Container26 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative w-full">
        <div className="flex flex-col font-['Nimbus_Sans:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#9ca3af] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[16px] whitespace-pre-wrap">Agent Reasoning Engine (Decision Log)</p>
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.88px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[11px] w-full">
          <p className="whitespace-pre-wrap">
            <span className="leading-[17.88px]">[14:02:11.002]</span>
            <span className="font-['Liberation_Mono:Regular',sans-serif] leading-[17.88px] not-italic text-[#9ca3af]">{` SYSTEM: Initiating deep neural scan of workspace...`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.88px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[11px] w-full">
          <p className="whitespace-pre-wrap">
            <span className="leading-[17.88px]">[14:02:11.450]</span>
            <span className="font-['Liberation_Mono:Regular',sans-serif] leading-[17.88px] not-italic text-[#9ca3af]">{` ANALYZER: Found deprecated encryption method in \`jwt_provider.py\` (Line 142).`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.88px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[11px] w-full">
          <p className="whitespace-pre-wrap">
            <span className="leading-[17.88px]">[14:02:11.455]</span>
            <span className="font-['Liberation_Mono:Regular',sans-serif] leading-[17.88px] not-italic text-[#9ca3af]">{` REASONING: Deprecated method \`HS256\` detected. Enterprise security policy mandates \`RS256\`.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.88px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#f59e0b] text-[11px] w-full">
          <p className="whitespace-pre-wrap">
            <span className="leading-[17.88px]">[14:02:11.890]</span>
            <span className="font-['Liberation_Mono:Regular',sans-serif] leading-[17.88px] not-italic text-[#9ca3af]">{` ACTION: Replacing insecure cryptographic headers. Validating key-pair integrity...`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.88px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#10b981] text-[11px] w-full">
          <p className="whitespace-pre-wrap">
            <span className="leading-[17.88px]">[14:02:12.110]</span>
            <span className="font-['Liberation_Mono:Regular',sans-serif] leading-[17.88px] not-italic text-[#9ca3af]">{` RESULT: Remediation successful. No side-effects detected in local dependency graph.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[0.88px] relative w-full">
        <div className="flex flex-col font-['Liberation_Mono:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#3b82f6] text-[11px] w-full">
          <p className="whitespace-pre-wrap">
            <span className="leading-[17.88px]">[14:02:12.301]</span>
            <span className="font-['Liberation_Mono:Regular',sans-serif] leading-[17.88px] not-italic text-[#9ca3af]">{` SYSTEM: Integrity check passed for build artifact 8f2a11b.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder12() {
  return (
    <div className="bg-[rgba(0,0,0,0.6)] max-h-[192px] relative rounded-[4px] shrink-0 w-full" data-name="Overlay+Border">
      <div className="max-h-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7px] items-start max-h-[inherit] pb-[16.99px] pt-[16px] px-[17px] relative w-full">
          <Container36 />
          <Container37 />
          <Container38 />
          <Container39 />
          <Container40 />
          <Container41 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#1f2937] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function Section5DecisionLog() {
  return (
    <div className="backdrop-blur-[6px] bg-[rgba(23,23,26,0.7)] relative rounded-[8px] shrink-0 w-full" data-name="Section 5 - Decision Log">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.08)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative w-full">
        <Heading3 />
        <OverlayBorder12 />
      </div>
    </div>
  );
}

function MainDashboardContainer() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start max-w-[1200px] relative shrink-0 w-full" data-name="Main - DashboardContainer">
      <Section1SummaryInformation />
      <Section2ScoreAnalysis />
      <Section3EnterpriseDataTable />
      <Section4DesktopTimeline />
      <Section5DecisionLog />
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#0a0a0c] content-stretch flex flex-col items-start pb-[53.75px] pt-[40px] px-[40px] relative size-full" data-name="DASHBOARD">
      <MainDashboardContainer />
    </div>
  );
}