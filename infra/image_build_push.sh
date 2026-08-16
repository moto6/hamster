#!/bin/bash
set -e

# 컨테이너 이미지 빌드 + (선택) 레지스트리 푸시.
# 실행 권한 부여: chmod +x infra/image_build_push.sh
#
# 사용법:
#   # 개별 빌드: ./image_build_push.sh <TAG> <APP_NAME> <CONTEXT_DIR>
#   ./image_build_push.sh latest hamster-back  ../hamster-back
#   ./image_build_push.sh latest hamster-front ../hamster-front
#
#   # 인자 없이 실행하면 hamster-back / hamster-front 둘 다 빌드.
#   ./image_build_push.sh
#
# 레지스트리/자격증명은 환경변수로 주입(레포에 비밀 커밋 금지):
#   REGISTRY=registry.example.com REGISTRY_USER=... REGISTRY_PASS=... ./image_build_push.sh

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
REGISTRY_URL="${REGISTRY:-localhost}"

# 자격증명이 설정된 경우에만 로그인(로컬 빌드면 생략).
if [ -n "${REGISTRY_USER}" ]; then
  docker login "${REGISTRY_URL}" --username "${REGISTRY_USER}" --password "${REGISTRY_PASS}"
fi

build_and_push() {
  local tag_version="$1"
  local app_name="$2"
  local context_dir="$3"      # Dockerfile 이 있는 빌드 컨텍스트 디렉터리
  local full_image_path="${REGISTRY_URL}/${app_name}:${tag_version}"

  echo "=================================================="
  echo "🔨 빌드 시작: ${full_image_path}  (context: ${context_dir})"
  echo "=================================================="

  docker build \
    --platform linux/amd64 \
    -f "${ROOT_DIR}/${context_dir}/Dockerfile" \
    -t "${full_image_path}" \
    "${ROOT_DIR}/${context_dir}"

  # 레지스트리가 localhost(기본값)면 푸시는 건너뛴다.
  if [ "${REGISTRY_URL}" != "localhost" ]; then
    docker push "${full_image_path}"
  fi

  echo "🎉 완료: ${full_image_path}"
}

# 인자가 주어지면 개별 빌드, 없으면 back/front 둘 다 빌드.
if [ -n "$2" ]; then
  TAG_VERSION="${1:-latest}"
  APP_NAME="$2"
  CONTEXT_DIR="${3}"
  if [ -z "${CONTEXT_DIR}" ]; then echo "❌ CONTEXT_DIR(3번째 인자)이 필요합니다." >&2; exit 1; fi
  build_and_push "${TAG_VERSION}" "${APP_NAME}" "${CONTEXT_DIR}"
else
  TAG_VERSION="${1:-latest}"
  build_and_push "${TAG_VERSION}" "hamster-back"  "../hamster-back"
  build_and_push "${TAG_VERSION}" "hamster-front" "../hamster-front"
fi
