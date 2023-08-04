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

export const SwitchKeys_Layout = () => {
	return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path fill="currentColor" d="M18 3C15.0333 3 12.1332 3.87973 9.66645 5.52796C7.19972 7.17618 5.27713 9.51886 4.14181 12.2597C3.0065 15.0006 2.70945 18.0166 3.28823 20.9264C3.86701 23.8361 5.29562 26.5088 7.3934 28.6066C9.49119 30.7044 12.1639 32.133 15.0737 32.7118C17.9834 33.2906 20.9994 32.9935 23.7403 31.8582C26.4811 30.7229 28.8238 28.8003 30.472 26.3336C32.1203 23.8668 33 20.9667 33 18C33 16.0302 32.612 14.0796 31.8582 12.2597C31.1044 10.4399 29.9995 8.78628 28.6066 7.3934C27.2137 6.00052 25.5601 4.89563 23.7403 4.14181C21.9204 3.38799 19.9698 3 18 3ZM28.82 16.1H24.35C24.2655 13.4171 23.8112 10.7587 23 8.2C24.5154 8.97652 25.8298 10.0942 26.8397 11.4651C27.8496 12.836 28.5275 14.4226 28.82 16.1ZM18.09 29H17.91C17.16 28.35 15.73 25.29 15.45 19.9H20.55C20.27 25.29 18.84 28.35 18.09 29ZM15.45 16.1C15.73 10.71 17.16 7.65 17.91 7H18.09C18.84 7.65 20.27 10.71 20.55 16.1H15.45ZM13 8.2C12.1752 10.7568 11.7075 13.4152 11.61 16.1H7.18001C7.47249 14.4226 8.15039 12.836 9.16033 11.4651C10.1703 10.0942 11.4847 8.97652 13 8.2ZM7.18001 19.9H11.65C11.7345 22.5829 12.1888 25.2413 13 27.8C11.4847 27.0235 10.1703 25.9058 9.16033 24.5349C8.15039 23.164 7.47249 21.5774 7.18001 19.9ZM23 27.8C23.8248 25.2432 24.2925 22.5848 24.39 19.9H28.86C28.5633 21.5812 27.8793 23.1703 26.8622 24.5415C25.8451 25.9126 24.5228 27.0282 23 27.8Z"></path></svg>;
}