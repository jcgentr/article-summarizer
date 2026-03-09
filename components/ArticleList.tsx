"use client";

import { Article } from "@/app/(protected)/types";
import { fetchArticles } from "@/app/(protected)/fetch-articles";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { ArrowUp, Loader2 } from "lucide-react";
import { AddForm } from "./AddForm";
import { ArticleCard } from "./ArticleCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SortDropdown, SortOption } from "./SortDropdown";
import FilterDropdown, { FilterId } from "./FilterDropdown";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export function ArticleList({
  initialArticles,
  initialTotalCount,
  allTags,
  currentTag,
}: {
  initialArticles: Article[];
  initialTotalCount: number;
  allTags: string[];
  currentTag?: string;
}) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState<SortOption>("Newest first");
  const [selectedFilter, setSelectedFilter] = useState<FilterId>("none");
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const { showScrollTop, scrollToTop } = useScrollToTop();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  const hasMore = articles.length < totalCount;

  const virtualizer = useWindowVirtualizer({
    count: articles.length,
    estimateSize: () => 300,
    overscan: 5,
    gap: 16,
    scrollMargin: listRef.current?.offsetTop ?? 0,
  });

  // Refetch when search/filter/sort changes (skip initial mount)
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    startTransition(async () => {
      const result = await fetchArticles({
        search: debouncedSearch,
        filter: selectedFilter,
        sort: sortValue,
        page: 0,
        tag: currentTag,
      });
      setArticles(result.articles);
      setTotalCount(result.totalCount);
      setPage(0);
    });
  }, [debouncedSearch, selectedFilter, sortValue, currentTag]);

  // Sync with server revalidation (e.g., after adding/deleting an article)
  const prevInitialRef = useRef(initialArticles);
  useEffect(() => {
    if (prevInitialRef.current === initialArticles) return;
    prevInitialRef.current = initialArticles;

    // If user has default params, just use the server data directly
    if (
      debouncedSearch === "" &&
      selectedFilter === "none" &&
      sortValue === "Newest first"
    ) {
      setArticles(initialArticles);
      setTotalCount(initialTotalCount);
      setPage(0);
      return;
    }

    // Otherwise refetch with current params
    startTransition(async () => {
      const result = await fetchArticles({
        search: debouncedSearch,
        filter: selectedFilter,
        sort: sortValue,
        page: 0,
        tag: currentTag,
      });
      setArticles(result.articles);
      setTotalCount(result.totalCount);
      setPage(0);
    });
  }, [
    initialArticles,
    initialTotalCount,
    debouncedSearch,
    selectedFilter,
    sortValue,
    currentTag,
  ]);

  // Load more articles
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    const result = await fetchArticles({
      search: debouncedSearch,
      filter: selectedFilter,
      sort: sortValue,
      page: nextPage,
      tag: currentTag,
    });
    setArticles((prev) => [...prev, ...result.articles]);
    setTotalCount(result.totalCount);
    setPage(nextPage);
    setIsLoadingMore(false);
  }, [
    page,
    debouncedSearch,
    selectedFilter,
    sortValue,
    currentTag,
    isLoadingMore,
    hasMore,
  ]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isPending
        ) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore, isPending]);

  return (
    <>
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 pt-3 pb-4">
        <AddForm currentTag={currentTag} />
        <div className="flex mt-4 gap-3 items-baseline">
          <Input
            type="search"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <div className="text-sm text-muted-foreground shrink-0">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {totalCount} {totalCount === 1 ? "article" : "articles"}
              </>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-3 flex-wrap">
          <SortDropdown value={sortValue} onValueChange={setSortValue} />
          <FilterDropdown
            value={selectedFilter}
            onValueChange={setSelectedFilter}
          />
        </div>
      </div>

      {isPending && articles.length === 0 ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : articles.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No articles found
        </p>
      ) : (
        <div
          ref={listRef}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const article = articles[virtualItem.index];
            return (
              <div
                key={article.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
                }}
              >
                <div>
                  <ArticleCard
                    {...article}
                    handleTagClick={(tag: string) =>
                      router.push(`/tags/${encodeURIComponent(tag)}`)
                    }
                    allTags={allTags}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="h-1" />
      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-4 md:bottom-12 md:right-16 rounded-full p-3 h-auto"
          size="icon"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
