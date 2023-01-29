import React from "react";

export const ActiveIcon = () =>
{
	//By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL


	const style1 = {
		animationDuration: "3s",
		animationName: "Deckyboard_ActiveIcon_AnimationA",
		animationDelay: "1.5s",
		animationIterationCount: "infinite",
	};
	const style2 = {
		animationDuration: "3s",
		animationName: "Deckyboard_ActiveIcon_AnimationA",
		animationDelay: "3s",
		animationIterationCount: "infinite",
	};
	const style3 = {
		animationDuration: "1.5s",
		animationName: "Deckyboard_ActiveIcon_AnimationB",
		animationDelay: "0s",
		animationIterationCount: "infinite",
	};

	const animation1 = `@keyframes Deckyboard_ActiveIcon_AnimationA {
		0% {
		  r: 6;
		  stroke-opacity: 1;
		  stroke-width: 2;
		}
		100% {
		  r: 22;
		  stroke-opacity: 0;
		  stroke-width: 0;
		}
	  }`;

	const animation2 = `@keyframes Deckyboard_ActiveIcon_AnimationB {
		0% { r: 6; }
		14% { r: 1; }
		28% { r: 2; }
		42% { r: 3; }
		56% { r: 4; }
		70% { r: 5; }
		100% { r: 6; }
	  }`;

	return <svg width="75" height="75" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
		<g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
			<circle cx="22" cy="22" r="6" stroke-opacity="0" style={style1}>
				<style>{animation1}</style>
			</circle>
			<circle cx="22" cy="22" r="6" stroke-opacity="0" style={style2}>
				<style>{animation1}</style>
			</circle>
			<circle cx="22" cy="22" r="8" style={style3}>
				<style>{animation2}</style>
			</circle>
		</g>
	</svg>;
};