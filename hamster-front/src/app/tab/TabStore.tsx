// @/app/tab/TabStore.tsx
import {type ReactNode, useCallback, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {GNB_NAV_ITEMS} from "@/app/gnb/navigation.config.tsx";
import {TabContext, type TabItem, type TabState} from "@/app/tab/tabs";

export function TabProvider({children}: { children: ReactNode }) {
    const location = useLocation();
    const navigate = useNavigate();

    // [핵심 해결 1] Lazy Initialization
    // useEffect가 아니라, state가 처음 만들어질 때 URL을 확인해서 초기값을 결정합니다.
    // 이렇게 하면 "렌더링 후 setState" 경고가 원천적으로 사라집니다.
    const [state, setState] = useState<TabState>(() => {
        const initialPath = location.pathname;
        const matched = GNB_NAV_ITEMS.find((i) => i.path === initialPath);

        if (matched) {
            return {
                activeTabId: matched.path,
                tabs: [{
                    id: matched.path,
                    label: matched.label,
                    path: matched.path,
                    element: matched.element,
                    closable: matched.path !== "/admin",
                }],
            };
        }

        // 매칭되는 탭이 없으면 빈 상태로 시작
        return {activeTabId: "", tabs: []};
    });

    // 탭 열기 (이제 이 함수가 네비게이션도 주도합니다)
    const openTab = useCallback((item: TabItem) => {
        setState((prev) => {
            // 이미 존재하는 탭이면 active만 변경
            if (prev.tabs.some((t) => t.id === item.id)) {
                return {...prev, activeTabId: item.id};
            }
            // 없으면 추가
            return {tabs: [...prev.tabs, item], activeTabId: item.id};
        });

        // [중요] 상태 변경과 동시에 라우팅 처리
        if (location.pathname !== item.path) {
            navigate(item.path);
        }
    }, [location.pathname, navigate]);

    // 탭 닫기
    const closeTab = useCallback((id: string) => {
        setState((prev) => {
            const targetIndex = prev.tabs.findIndex((t) => t.id === id);
            if (targetIndex === -1) return prev; // 없으면 무시

            const newTabs = prev.tabs.filter((t) => t.id !== id);

            // 닫는 탭이 현재 활성 탭이었다면, 다른 탭으로 이동해야 함
            if (prev.activeTabId === id) {
                // 왼쪽 탭, 혹은 없으면 오른쪽 탭, 다 없으면 빈 값
                const nextTab = newTabs[targetIndex - 1] || newTabs[targetIndex] || null;
                const nextActiveId = nextTab ? nextTab.id : "";

                // 닫으면서 이동할 곳이 있다면 라우팅도 함께 처리
                if (nextTab) {
                    navigate(nextTab.path);
                } else {
                    navigate("/"); // 다 닫았으면 홈으로
                }

                return {tabs: newTabs, activeTabId: nextActiveId};
            }

            // 활성 탭이 아니면 목록에서만 제거
            return {...prev, tabs: newTabs};
        });
    }, [navigate]);

    // 탭 클릭해서 활성화 (단순 전환)
    const setActiveTab = useCallback((id: string) => {
        setState((prev) => ({...prev, activeTabId: id}));
        navigate(id); // 클릭 시 라우팅 이동
    }, [navigate]);


    // [핵심 해결 2] 브라우저 뒤로가기/앞으로가기 동기화
    // 사용자가 UI 클릭이 아니라 브라우저 버튼으로 이동했을 때만 작동합니다.
    useEffect(() => {
        // 현재 활성 탭과 URL이 다를 때만 동기화 (무한 루프 방지)
        if (state.activeTabId !== location.pathname) {
            const matched = GNB_NAV_ITEMS.find((i) => i.path === location.pathname);

            if (matched) {
                // setState를 쓰지만, 조건부이므로 안전함
                // 여기서는 openTab을 호출하지 않고 state만 조용히 맞춥니다 (이미 URL은 변했으니까)
                setState((prev) => {
                    const exists = prev.tabs.find(t => t.id === matched.path);
                    if (exists) {
                        return {...prev, activeTabId: matched.path};
                    }
                    // 뒤로가기로 왔는데 탭 목록에 없으면 새로 추가해줌
                    return {
                        tabs: [...prev.tabs, {
                            id: matched.path,
                            label: matched.label,
                            path: matched.path,
                            element: matched.element,
                            closable: matched.path !== "/admin"
                        }],
                        activeTabId: matched.path
                    };
                });
            }
        }
    }, [location.pathname]); // 의존성 배열 최소화

    return (
        <TabContext.Provider value={{...state, openTab, closeTab, setActiveTab}}>
            {children}
        </TabContext.Provider>
    );
};