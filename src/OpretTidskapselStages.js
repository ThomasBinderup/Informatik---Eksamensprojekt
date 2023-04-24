import React from 'react'
import './OpretTidskapselStages.css'

export default function OpretTidskapselStages(props) {

    if (props.stage === '1') {
  return (
    <div className="stages"><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage" id="stage1Circle">
    radio_button_checked
    </span><span className="stagesText" id="stagesText1">Bekræft&nbsp;identitet</span></span><span id="lineStage1"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage">
    circle
    </span><span className="stagesText" id="stagesText2">Tidskapsel</span></span>
    <span id="lineStage2"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage">
circle
</span><span className="stagesText" id="stagesText3">Indstillinger</span></span><span id="lineStage3"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage">
    flag_circle
    </span><span className="stagesText" id="stagesText4">Betaling</span></span></div>
  )
    } else if (props.stage === '2') {
      return (
        <div className="stages"><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage" id="stage1Circle">
        check_circle
        </span><span className="stagesText" id="stagesText1" >Bekræft&nbsp;identitet</span></span><span id="lineStage1"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage stagesIcon1Stage2">
        radio_button_checked
        </span><span className="stagesText stagesText1Stage2" id="stagesText2">Tidskapsel</span></span>
        <span id="lineStage2"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage">
    circle
    </span><span className="stagesText" id="stagesText3">Indstillinger</span></span><span id="lineStage3"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage">
        flag_circle
        </span><span className="stagesText" id="stagesText4">Betaling</span></span></div>
      )
    } else if (props.stage === '3') {
      return (
        <div className="stages"><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage" id="stage1Circle">
        check_circle
        </span><span className="stagesText" id="stagesText1" >Bekræft&nbsp;identitet</span></span><span id="lineStage1"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage stagesIcon1Stage2">
        check_circle
        </span><span className="stagesText stagesText1Stage2" id="stagesText2">Tidskapsel</span></span>
        <span id="lineStage2"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage" id="stage3BlueCircle">
        radio_button_checked
    </span><span className="stagesText stage3BlueText" id="stagesText3">Indstillinger</span></span><span id="lineStage3"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage">
        flag_circle
        </span><span className="stagesText" id="stagesText4">Betaling</span></span></div>
      )
    } else if (props.stage === '4') {
      return (
        <div className="stages"><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage" id="stage1Circle">
        check_circle
        </span><span className="stagesText" id="stagesText1" >Bekræft&nbsp;identitet</span></span><span id="lineStage1"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage stagesIcon1Stage2">
        check_circle
        </span><span className="stagesText stagesText1Stage2" id="stagesText2">Tidskapsel</span></span>
        <span id="lineStage2"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage" id="stage3BlueCircle">
        check_circle
    </span><span className="stagesText stage3BlueText" id="stagesText3">Indstillinger</span></span><span id="lineStage3"></span><span className="stagesSymbolTextContainer"><span className="material-symbols-outlined circleStage circleStage4">
        flag_circle
        </span><span className="stagesText stages4BlueText" id="stagesText4">Betaling</span></span></div>
      )
    }
}
