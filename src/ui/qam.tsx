import { ButtonItem, DialogButton, Navigation, PanelSection, PanelSectionRow, Router } from "decky-frontend-lib";

export default function QuickAccessMenu() {


    const onSettingsClick = () => {
        Navigation.CloseSideMenus();
        Router.Navigate('/deckyboard/settings');
    }

    return (
		<PanelSection>
			<PanelSectionRow>
        <DialogButton onClick={onSettingsClick}>Go to Settings</DialogButton>
			</PanelSectionRow>
		</PanelSection>
    );
}