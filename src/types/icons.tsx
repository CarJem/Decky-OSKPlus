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

export const VKClose = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M2 6H34V23H2V6ZM5 10H7V12H5V10ZM7 14H5V16H7V14ZM5 18H7V20H5V18ZM11 10H9V12H11V10ZM9 14H11V16H9V14ZM15 10H13V12H15V10ZM13 14H15V16H13V14ZM27 18H9V20H27V18ZM17 10H19V12H17V10ZM19 14H17V16H19V14ZM21 10H23V12H21V10ZM27 10H25V12H27V10ZM29 10H31V12H29V10ZM23 14H21V16H23V14ZM25 14H27V16H25V14ZM31 14H29V16H31V14ZM29 18H31V20H29V18ZM18 32L23 27H13L18 32Z" fill="currentColor"></path></svg>;
}