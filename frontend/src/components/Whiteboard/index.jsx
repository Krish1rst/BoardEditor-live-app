import React, { useState,useEffect, useRef, useLayoutEffect } from 'react';
import rough from 'roughjs';
                                                
const roughGenerator =rough.generator();

function WhiteBoard({ canvasRef,tool,color, ctxRef,elements,setElements }) {

  const [isDrawing,setIsDrawing]=useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.height=window.innerHeight*2;
    canvas.width=window.innerWidth*2;
    
    ctx.strokeStyle=color;
    ctx.lineWidth=2;
    ctx.lineCap="round";
    ctxRef.current = ctx;
  }, []); 
  useEffect(()=>{
    ctxRef.current.strokeStyle=color;
  },[color])

  useLayoutEffect(()=>{
    const roughCanvas= rough.canvas(canvasRef.current);
    if(elements.length>0){
      ctxRef.current.clearRect(
        0,0,canvasRef.current.width,
        canvasRef.current.height
      )
    }
    elements.forEach((ele)=>{
      if(ele.type==="rect"){
        roughCanvas.draw(
          roughGenerator.rectangle(
            ele.offsetX,
            ele.offsetY,
            ele.width,
            ele.height,
            {
              stroke:ele.stroke,
              strokeWidth:3,
              roughness:1,
            }
          )
        )
      }
       else if(ele.type==='pencil'){
          roughCanvas.linearPath(ele.path, {
            stroke:ele.stroke,
            strokeWidth:3,
            roughness:1,
          });
        }
       else if(ele.type==="line"){
          roughCanvas.draw(
            roughGenerator.line(ele.offsetX,ele.offsetY,ele.width,ele.height, {
              stroke:ele.stroke,
              strokeWidth:3,
              roughness:1,
            })
          )
        }
    })
  },[elements])

  const handleMouseDown = (e) => {
    const {offsetX,offsetY}=e.nativeEvent;
    
    if(tool==='pencil'){        
    setElements((prevElements)=>[...prevElements,{
      type:'pencil',
      offsetX,
      offsetY,
      path:[[offsetX,offsetY]],
      stroke:color,
    }]);
    }
    else if(tool==="line"){
      setElements((prevElements)=>
      [...prevElements,{
        type:"line",
        offsetX,
        offsetY,
        width:offsetX,
        height:offsetY,
        stroke:color,
      },]
      )
    }
    else if(tool==="rectangle"){
      setElements((prevElements)=>[
        ...prevElements,
        {
          type:"rect",
          offsetX,
          offsetY,
          width:0,
          height:0,
          stroke:color,
        },
      ])
    }
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
  const { offsetX, offsetY } = e.nativeEvent;

  if (isDrawing) {
    setElements((prevElements) => {
      const updatedElements = prevElements.map((ele, index) => {
        if (index === prevElements.length - 1) {
          if (tool === "pencil") {
            const { path } = ele;
            const newPath = [...path, [offsetX, offsetY]];
            return { ...ele, path: newPath };
          } else if (tool === "line") {
            return { ...ele, width: offsetX, height: offsetY };
          } else if (tool === "rectangle") {
            return {
              ...ele,
              width: offsetX - ele.offsetX,
              height: offsetY - ele.offsetY,
            };
          }
        }
        return ele;
      });
      return updatedElements;
    });
  }
};


  const handleMouseUp = (e) => {
    setIsDrawing(false);
  };

  return (
   <>   
   <div onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className='border border-dark border-3 h-100 w-100 overflow-hidden'>
          <canvas ref={canvasRef}/>
   </div>
   
   </>
  );
}

export default WhiteBoard;
